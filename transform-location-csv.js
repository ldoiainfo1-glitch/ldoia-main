const fs = require('fs');
const path = require('path');

// State to Zone mapping (based on Indian geographical zones)
const stateToZone = {
  // Western India
  'RAJASTHAN': 'Western India',
  'MAHARASHTRA': 'Western India',
  'GUJARAT': 'Western India',
  'GOA': 'Western India',
  'DADRA AND NAGAR HAVELI': 'Western India',
  'DAMAN AND DIU': 'Western India',
  
  // South India
  'TAMIL NADU': 'South India',
  'TELANGANA': 'South India',
  'PONDICHERRY': 'South India',
  'PUDUCHERRY': 'South India',
  'ANDAMAN AND NICOBAR': 'South India',
  'LAKSHADWEEP': 'South India',
  'KERALA': 'South India',
  'ANDHRA PRADESH': 'South India',
  'KARNATAKA': 'South India',
  
  // North East India
  'TRIPURA': 'North East',
  'NAGALAND': 'North East',
  'MIZORAM': 'North East',
  'MEGHALAYA': 'North East',
  'MANIPUR': 'North East',
  'ARUNACHAL PRADESH': 'North East',
  'ASSAM': 'North East',
  
  // East India
  'WEST BENGAL': 'East India',
  'ODISHA': 'East India',
  'ORISSA': 'East India',
  'JHARKHAND': 'East India',
  'BIHAR': 'East India',
  'SIKKIM': 'East India',
  
  // North India
  'UTTAR PRADESH': 'North India',
  'UTTARAKHAND': 'North India',
  'UTTARANCHAL': 'North India',
  'PUNJAB': 'North India',
  'LADAKH': 'North India',
  'JAMMU AND KASHMIR': 'North India',
  'JAMMU & KASHMIR': 'North India',
  'HIMACHAL PRADESH': 'North India',
  'HARYANA': 'North India',
  'DELHI': 'North India',
  'CHANDIGARH': 'North India',
  
  // Central India
  'MADHYA PRADESH': 'Central India',
  'CHHATTISGARH': 'Central India',
  'CHATTISGARH': 'Central India'
};

console.log('🚀 Starting CSV transformation...\n');

// Read the original CSV
const inputFile = path.join(__dirname, 'public', 'location.csv');
const outputFile = path.join(__dirname, 'public', 'location-transformed.csv');

console.log(`📂 Reading from: ${inputFile}`);

const csvContent = fs.readFileSync(inputFile, 'utf-8');
const lines = csvContent.split('\n');

console.log(`📊 Total lines in file: ${lines.length}`);

// Parse CSV (handle quoted fields with commas)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// New CSV headers matching your requirement
const newHeaders = [
  'country',
  'zone',
  'state',
  'division',
  'district',
  'taluka',
  'pincode',
  'postOffice',
  'officetype',
  'delivery',
  'latitude',
  'longitude'
];

// Start building new CSV
const newLines = [];
newLines.push(newHeaders.join(','));

let processedCount = 0;
let skippedCount = 0;
let unknownZones = new Set();

// Process each line (skip header and empty lines)
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Skip empty lines
  if (!line || line === ',,,,,,,,,,') {
    skippedCount++;
    continue;
  }
  
  const fields = parseCSVLine(line);
  
  // Original structure:
  // [0] circlename, [1] regionname, [2] divisionname, [3] postOffice, 
  // [4] pincode, [5] officetype, [6] delivery, [7] district, 
  // [8] statename, [9] latitude, [10] longitude
  
  const statename = fields[8] ? fields[8].toUpperCase().trim() : '';
  const district = fields[7] ? fields[7].trim() : '';
  const divisionname = fields[2] ? fields[2].trim() : '';
  const postOffice = fields[3] ? fields[3].trim() : '';
  const pincode = fields[4] ? fields[4].trim() : '';
  const officetype = fields[5] ? fields[5].trim() : '';
  const delivery = fields[6] ? fields[6].trim() : '';
  const latitude = fields[9] ? fields[9].trim() : '';
  const longitude = fields[10] ? fields[10].trim() : '';
  
  // Skip if essential fields are missing
  if (!statename || !pincode || !postOffice) {
    skippedCount++;
    continue;
  }
  
  // Get zone from state
  const zone = stateToZone[statename] || 'Unknown';
  if (zone === 'Unknown') {
    unknownZones.add(statename);
  }
  
  // Create new row
  const newRow = [
    'India',                    // country
    zone,                       // zone
    statename,                  // state
    divisionname,               // division
    district,                   // district
    '',                         // taluka (not available in source data)
    pincode,                    // pincode
    postOffice,                 // postOffice
    officetype,                 // officetype
    delivery,                   // delivery
    latitude,                   // latitude
    longitude                   // longitude
  ];
  
  // Escape fields with commas or quotes
  const escapedRow = newRow.map(field => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  });
  
  newLines.push(escapedRow.join(','));
  processedCount++;
  
  // Progress indicator
  if (processedCount % 10000 === 0) {
    console.log(`✅ Processed ${processedCount} records...`);
  }
}

// Write the transformed CSV
fs.writeFileSync(outputFile, newLines.join('\n'), 'utf-8');

console.log('\n🎉 Transformation Complete!\n');
console.log('📈 Statistics:');
console.log(`   ✅ Total records processed: ${processedCount}`);
console.log(`   ⏭️  Records skipped: ${skippedCount}`);
console.log(`   📝 Output file: ${outputFile}`);
console.log(`   📦 Output size: ${newLines.length} lines\n`);

if (unknownZones.size > 0) {
  console.log('⚠️  Unknown states (need zone mapping):');
  unknownZones.forEach(state => console.log(`   - ${state}`));
  console.log('');
}

// Show sample of transformed data
console.log('📋 Sample transformed data (first 5 rows):');
console.log(newLines.slice(0, 6).join('\n'));
console.log('\n✨ Ready for MongoDB import!');
