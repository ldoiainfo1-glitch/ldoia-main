/**
 * Merge Taluka Data from india.csv to location-transformed.csv
 * 
 * This script reads taluka names from india.csv and updates location-transformed.csv
 */

const fs = require('fs');
const path = require('path');

// File paths
const indiaCsvPath = path.join(__dirname, '../public/india.csv');
const transformedCsvPath = path.join(__dirname, '../public/location-transformed.csv');
const outputCsvPath = path.join(__dirname, '../public/location-with-taluka-india.csv');

console.log('🚀 Merging Taluka Data from india.csv');
console.log('='.repeat(70));

// Read india.csv and build pincode -> taluka mapping
console.log('\n📖 Reading india.csv...');
const indiaData = fs.readFileSync(indiaCsvPath, 'utf8');
const indiaLines = indiaData.split('\n').filter(line => line.trim());

console.log(`   Found ${indiaLines.length.toLocaleString()} lines`);

// Parse india.csv header
const indiaHeader = indiaLines[0].split(',');
console.log(`   Headers: ${indiaHeader.join(', ')}`);

// Build mapping: pincode -> { taluka, district, state }
const pincodeToTalukaMap = new Map();
let validCount = 0;
let naCount = 0;

for (let i = 1; i < indiaLines.length; i++) {
  const line = indiaLines[i].trim();
  if (!line) continue;

  const fields = line.split(',');
  const pincode = fields[0]?.trim();
  const taluka = fields[1]?.trim();
  const district = fields[2]?.trim();
  const state = fields[3]?.trim();

  if (pincode && taluka && district && state) {
    // Skip N/A talukas
    if (taluka.toUpperCase() === 'N/A') {
      naCount++;
      continue;
    }
    
    // Use first occurrence for each pincode
    if (!pincodeToTalukaMap.has(pincode)) {
      pincodeToTalukaMap.set(pincode, { taluka, district, state });
      validCount++;
    }
  }
}

console.log(`   ✅ Built mapping for ${pincodeToTalukaMap.size.toLocaleString()} unique pincodes`);
console.log(`   ✅ Valid talukas: ${validCount.toLocaleString()}`);
console.log(`   ⚠️  Skipped N/A talukas: ${naCount.toLocaleString()}`);

// Read location-transformed.csv
console.log('\n📖 Reading location-transformed.csv...');
const transformedData = fs.readFileSync(transformedCsvPath, 'utf8');
const transformedLines = transformedData.split('\n');

console.log(`   Found ${transformedLines.length.toLocaleString()} lines`);

// Parse header
const transformedHeader = transformedLines[0].split(',');
const talukaIndex = transformedHeader.indexOf('taluka');
const pincodeIndex = transformedHeader.indexOf('pincode');
const districtIndex = transformedHeader.indexOf('district');
const stateIndex = transformedHeader.indexOf('state');

console.log(`   Taluka field at column ${talukaIndex}`);
console.log(`   Pincode field at column ${pincodeIndex}`);
console.log(`   District field at column ${districtIndex}`);
console.log(`   State field at column ${stateIndex}`);

// Process transformed CSV and add taluka
console.log('\n🔄 Adding taluka data from india.csv...');
const outputLines = [transformedLines[0]]; // Keep header
let updatedCount = 0;
let notFoundCount = 0;
let districtMismatchCount = 0;
let stateMismatchCount = 0;
let alreadyHasTalukaCount = 0;

for (let i = 1; i < transformedLines.length; i++) {
  const line = transformedLines[i].trim();
  if (!line) continue;

  const fields = line.split(',');
  const pincode = fields[pincodeIndex]?.trim();
  const currentDistrict = fields[districtIndex]?.trim();
  const currentState = fields[stateIndex]?.trim();
  const currentTaluka = fields[talukaIndex]?.trim();

  if (pincode && pincodeToTalukaMap.has(pincode)) {
    const { taluka, district, state } = pincodeToTalukaMap.get(pincode);
    
    // Check if taluka is already populated from division
    if (currentTaluka && currentTaluka !== '') {
      // Replace division-based taluka with actual taluka from india.csv
      fields[talukaIndex] = taluka;
      alreadyHasTalukaCount++;
      updatedCount++;
    } else {
      // Add taluka from india.csv
      fields[talukaIndex] = taluka;
      updatedCount++;
    }
    
    // Track mismatches for reporting (but still update)
    const districtMatch = currentDistrict.toUpperCase().includes(district.toUpperCase()) || 
                          district.toUpperCase().includes(currentDistrict.toUpperCase());
    const stateMatch = currentState.toUpperCase() === state.toUpperCase();
    
    if (!districtMatch) districtMismatchCount++;
    if (!stateMatch) stateMismatchCount++;
    
  } else {
    // Pincode not found in india.csv - keep division name as taluka if it exists
    if (!currentTaluka || currentTaluka === '') {
      // Use division field as fallback
      const divisionIndex = transformedHeader.indexOf('division');
      if (divisionIndex !== -1) {
        const division = fields[divisionIndex]?.trim();
        if (division) {
          fields[talukaIndex] = division;
        }
      }
    }
    notFoundCount++;
  }

  outputLines.push(fields.join(','));

  // Progress indicator
  if (i % 10000 === 0) {
    process.stdout.write(`\r   Processing: ${i.toLocaleString()}/${transformedLines.length.toLocaleString()} lines`);
  }
}

console.log(`\n`);
console.log('📊 RESULTS:');
console.log('='.repeat(70));
console.log(`   ✅ Updated with india.csv taluka: ${updatedCount.toLocaleString()} records`);
console.log(`   ℹ️  Replaced division with actual taluka: ${alreadyHasTalukaCount.toLocaleString()} records`);
console.log(`   ⚠️  District mismatch (still updated): ${districtMismatchCount.toLocaleString()} records`);
console.log(`   ⚠️  State mismatch (still updated): ${stateMismatchCount.toLocaleString()} records`);
console.log(`   ❌ Not found in india.csv: ${notFoundCount.toLocaleString()} records`);
console.log(`   📝 Total output: ${outputLines.length.toLocaleString()} lines`);

// Write output
console.log(`\n💾 Writing to ${outputCsvPath}...`);
fs.writeFileSync(outputCsvPath, outputLines.join('\n'), 'utf8');
console.log(`   ✅ Wrote ${outputLines.length.toLocaleString()} lines`);

// Sample data verification
console.log('\n🔍 SAMPLE DATA VERIFICATION:');
console.log('='.repeat(70));

// Check a few pincodes
const testPincodes = ['110001', '400102', '560001', '600001', '700001'];
for (const testPincode of testPincodes) {
  const mapping = pincodeToTalukaMap.get(testPincode);
  if (mapping) {
    console.log(`   ${testPincode}: ${mapping.taluka} → ${mapping.district}, ${mapping.state}`);
  }
}

console.log('\n✅ Complete!');
console.log('='.repeat(70));
console.log('\nNext steps:');
console.log('1. Verify: head -20 ../public/location-with-taluka-india.csv');
console.log('2. Replace: cp ../public/location-with-taluka-india.csv ../public/location-transformed.csv');
console.log('3. Import: cd ldoia-backend && node import-location-data-transformed.cjs');
console.log('4. Verify MongoDB: node verify-location-data.cjs');
console.log('5. Test API: node debug-location-api.cjs');
