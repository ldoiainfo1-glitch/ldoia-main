/**
 * Merge Taluka Data from Complete Indian Location Dataset
 * 
 * This script reads taluka information from the complete Indian location CSV
 * and merges it into location-transformed.csv based on pincode matching.
 */

const fs = require('fs');

// File paths
const TALUKA_SOURCE_CSV = '../public/All India Blank Data upto pincode 26000 - upto pincode (1).csv';
const LOCATION_CSV = '../public/location-transformed.csv';
const OUTPUT_CSV = '../public/location-with-taluka-merged.csv';

/**
 * Parse CSV line handling quoted fields
 */
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

/**
 * Build pincode-to-taluka mapping from source CSV
 */
function buildPincodeTalukaMap() {
  console.log('🔍 Reading taluka source CSV...');
  
  const content = fs.readFileSync(TALUKA_SOURCE_CSV, 'utf-8');
  const lines = content.split('\n');
  
  console.log(`✅ Found ${lines.length} lines in taluka source CSV\n`);
  
  const pincodeTalukaMap = new Map();
  let mappedCount = 0;
  let skippedCount = 0;
  
  // Process each line (skip header/metadata rows)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split by comma (simple split, as this CSV doesn't have quoted fields in data rows)
    const fields = line.split(',');
    
    // Skip if not enough fields
    if (fields.length < 20) {
      skippedCount++;
      continue;
    }
    
    // Based on structure: field[18] = pincode, field[16] = taluka (0-indexed)
    const pincode = fields[18] ? fields[18].trim() : '';
    const taluka = fields[16] ? fields[16].trim() : '';
    const district = fields[14] ? fields[14].trim() : '';
    const division = fields[12] ? fields[12].trim() : '';
    const state = fields[10] ? fields[10].trim() : '';
    
    // Verify pincode is numeric and has taluka
    if (pincode && /^\d{6}$/.test(pincode)) {
      // Store taluka data for this pincode
      if (!pincodeTalukaMap.has(pincode)) {
        pincodeTalukaMap.set(pincode, {
          taluka: taluka || '',
          district: district || '',
          division: division || '',
          state: state || ''
        });
        if (taluka) mappedCount++;
      }
    }
  }
  
  console.log(`📊 Built pincode-to-taluka mapping:`);
  console.log(`   Total unique pincodes: ${pincodeTalukaMap.size}`);
  console.log(`   Pincodes with taluka: ${mappedCount}`);
  console.log(`   Skipped rows: ${skippedCount}\n`);
  
  // Show sample mappings
  console.log('📋 Sample Mappings:');
  let sampleCount = 0;
  for (const [pincode, data] of pincodeTalukaMap.entries()) {
    if (data.taluka && sampleCount < 15) {
      console.log(`   ${pincode}: ${data.taluka} (${data.district}, ${data.state})`);
      sampleCount++;
    }
  }
  console.log('');
  
  return pincodeTalukaMap;
}

/**
 * Merge taluka data into location-transformed.csv
 */
function mergeTalukaData(pincodeTalukaMap) {
  console.log('📖 Reading location-transformed.csv...');
  
  const content = fs.readFileSync(LOCATION_CSV, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  console.log(`✅ Found ${lines.length} lines\n`);
  
  // Parse header
  const headerFields = parseCSVLine(lines[0]);
  console.log('📋 Current headers:', headerFields.join(', '));
  
  // Find column indexes
  const pincodeIndex = headerFields.indexOf('pincode');
  const talukaIndex = headerFields.indexOf('taluka');
  const districtIndex = headerFields.indexOf('district');
  
  if (pincodeIndex === -1) {
    console.error('❌ Error: pincode column not found');
    process.exit(1);
  }
  
  if (talukaIndex === -1) {
    console.error('❌ Error: taluka column not found');
    process.exit(1);
  }
  
  console.log(`   Pincode column: ${pincodeIndex}`);
  console.log(`   Taluka column: ${talukaIndex}`);
  console.log(`   District column: ${districtIndex}\n`);
  
  console.log('🔄 Merging taluka data...\n');
  
  const outputLines = [lines[0]]; // Keep header as is
  let matchedCount = 0;
  let notFoundCount = 0;
  let alreadyHadTaluka = 0;
  
  // Process data lines
  let districtMismatch = 0;
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    const pincode = fields[pincodeIndex];
    const existingTaluka = fields[talukaIndex];
    const district = fields[districtIndex] ? fields[districtIndex].toUpperCase().trim() : '';
    
    // Check if pincode exists in our mapping
    if (pincodeTalukaMap.has(pincode)) {
      const talukaData = pincodeTalukaMap.get(pincode);
      
      // Verify district matches (normalize for comparison)
      const sourceDistrict = talukaData.district.toUpperCase().trim();
      const districtMatch = 
        district === sourceDistrict || 
        district.replace(/\s+/g, '') === sourceDistrict.replace(/\s+/g, '') ||
        // Handle "Mumbai Suburban" vs "Mumbai Subarban" typo
        (district.includes('SUBURBAN') && sourceDistrict.includes('SUBARBAN')) ||
        (district.includes('SUBARBAN') && sourceDistrict.includes('SUBURBAN'));
      
      // Only update if taluka is currently empty AND district matches
      if (!existingTaluka || existingTaluka === '') {
        if (districtMatch || !talukaData.district) {
          fields[talukaIndex] = talukaData.taluka;
          matchedCount++;
        } else {
          // District doesn't match - skip to avoid data corruption
          districtMismatch++;
        }
      } else {
        alreadyHadTaluka++;
      }
    } else {
      notFoundCount++;
    }
    
    // Escape fields that contain commas or quotes
    const escapedFields = fields.map(field => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    });
    
    outputLines.push(escapedFields.join(','));
    
    // Progress indicator
    if (i % 10000 === 0) {
      console.log(`   Processed: ${i}/${lines.length - 1} | Matched: ${matchedCount} | Not found: ${notFoundCount}`);
    }
  }
  
  console.log('\n✅ Merging complete!');
  console.log(`\n📊 Statistics:`);
  console.log(`   Total records processed: ${lines.length - 1}`);
  console.log(`   Taluka added: ${matchedCount}`);
  console.log(`   Already had taluka: ${alreadyHadTaluka}`);
  console.log(`   Pincode not found in source: ${notFoundCount}`);
  console.log(`   District mismatch (skipped): ${districtMismatch}`);
  console.log(`   Success rate: ${((matchedCount / (lines.length - 1)) * 100).toFixed(2)}%\n`);
  
  // Write output file
  console.log(`💾 Writing to: ${OUTPUT_CSV}`);
  fs.writeFileSync(OUTPUT_CSV, outputLines.join('\n'));
  console.log('✅ File saved successfully!\n');
  
  // Show sample of updated records
  console.log('📋 Sample Updated Records:');
  let sampleCount = 0;
  for (let i = 1; i < lines.length && sampleCount < 10; i++) {
    const fields = parseCSVLine(outputLines[i]);
    const pincode = fields[pincodeIndex];
    const taluka = fields[talukaIndex];
    const district = fields[districtIndex];
    
    if (taluka && taluka !== '') {
      console.log(`   Pincode: ${pincode} → Taluka: ${taluka} (${district})`);
      sampleCount++;
    }
  }
  
  console.log('\n🎉 Taluka merge complete!');
  console.log(`\n📁 Output file: ${OUTPUT_CSV}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Review the output file');
  console.log('   2. If satisfied, replace location-transformed.csv:');
  console.log('      cp public/location-with-taluka-merged.csv public/location-transformed.csv');
  console.log('   3. Re-import to MongoDB:');
  console.log('      node import-location-data-transformed.cjs\n');
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Taluka Data Merge Tool\n');
  console.log('Source: All India Blank Data CSV');
  console.log('Target: location-transformed.csv\n');
  console.log('=' .repeat(60) + '\n');
  
  try {
    // Step 1: Build pincode-to-taluka mapping
    const pincodeTalukaMap = buildPincodeTalukaMap();
    
    console.log('=' .repeat(60) + '\n');
    
    // Step 2: Merge taluka data
    mergeTalukaData(pincodeTalukaMap);
    
    console.log('=' .repeat(60) + '\n');
    console.log('✅ SUCCESS! Taluka data has been merged.\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
main();
