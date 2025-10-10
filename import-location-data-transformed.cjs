const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection URL
const mongoURL = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = mongoURL.split('/').pop().split('?')[0] || 'ldoia_database';

console.log('🚀 Starting MongoDB import from transformed CSV...\n');
console.log(`📊 Database: ${dbName}`);
console.log(`🔗 MongoDB URL: ${mongoURL.split('@')[1] || mongoURL}\n`);

// Read the transformed CSV file
const csvFilePath = path.join(__dirname, 'public', 'location-transformed.csv');

if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ Error: File not found at ${csvFilePath}`);
  console.error('   Please run transform-location-csv.cjs first!');
  process.exit(1);
}

console.log(`📂 Reading CSV from: ${csvFilePath}`);

const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

console.log(`📊 Total lines: ${lines.length}\n`);

// Parse CSV function
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

// Parse headers
const headers = parseCSVLine(lines[0]);
console.log('📋 CSV Headers:', headers);
console.log('');

// Convert CSV to MongoDB documents
const locations = [];

for (let i = 1; i < lines.length; i++) {
  const values = parseCSVLine(lines[i]);
  
  if (values.length < headers.length) {
    continue; // Skip incomplete rows
  }
  
  const location = {};
  headers.forEach((header, index) => {
    const value = values[index] ? values[index].replace(/^"|"$/g, '') : '';
    
    // Convert latitude/longitude to numbers
    if (header === 'latitude' || header === 'longitude') {
      location[header] = value ? parseFloat(value) : null;
    } else {
      location[header] = value;
    }
  });
  
  // Add created timestamp
  location.createdAt = new Date();
  
  locations.push(location);
  
  // Progress indicator
  if (locations.length % 10000 === 0) {
    console.log(`📝 Parsed ${locations.length} records...`);
  }
}

console.log(`\n✅ Parsed ${locations.length} location records\n`);

// Connect to MongoDB and import
async function importToMongoDB() {
  const client = new MongoClient(mongoURL);
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully!\n');
    
    const db = client.db(dbName);
    const collection = db.collection('location_data');
    
    // Optional: Clear existing data
    console.log('🗑️  Clearing existing location data...');
    const deleteResult = await collection.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} existing records\n`);
    
    // Insert in batches
    console.log('📥 Importing location data...');
    const batchSize = 1000;
    let imported = 0;
    
    for (let i = 0; i < locations.length; i += batchSize) {
      const batch = locations.slice(i, i + batchSize);
      await collection.insertMany(batch);
      imported += batch.length;
      console.log(`   Imported ${imported}/${locations.length} records...`);
    }
    
    console.log('\n✅ Import completed!\n');
    
    // Create indexes for better query performance
    console.log('🔍 Creating indexes...');
    
    await collection.createIndex({ country: 1 });
    await collection.createIndex({ zone: 1 });
    await collection.createIndex({ state: 1 });
    await collection.createIndex({ district: 1 });
    await collection.createIndex({ pincode: 1 });
    await collection.createIndex({ country: 1, zone: 1, state: 1 });
    await collection.createIndex({ postOffice: 1 });
    
    console.log('✅ Indexes created successfully!\n');
    
    // Display statistics
    console.log('📊 Database Statistics:');
    const stats = await collection.stats();
    console.log(`   Total documents: ${stats.count}`);
    console.log(`   Storage size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Indexes: ${stats.nindexes}\n`);
    
    // Sample queries
    console.log('🔍 Sample Data Verification:\n');
    
    const countries = await collection.distinct('country');
    console.log(`   Countries: ${countries.join(', ')}`);
    
    const zones = await collection.distinct('zone');
    console.log(`   Zones (${zones.length}): ${zones.filter(z => z !== 'Unknown').join(', ')}`);
    
    const states = await collection.distinct('state');
    console.log(`   States: ${states.length} states/UTs`);
    
    const districts = await collection.distinct('district');
    console.log(`   Districts: ${districts.length} districts`);
    
    const pincodes = await collection.distinct('pincode');
    console.log(`   Pincodes: ${pincodes.length} unique pincodes\n`);
    
    // Sample records
    console.log('📋 Sample Location Records:');
    const samples = await collection.find({}).limit(3).toArray();
    samples.forEach((sample, idx) => {
      console.log(`\n   ${idx + 1}. ${sample.postOffice}`);
      console.log(`      Zone: ${sample.zone}`);
      console.log(`      State: ${sample.state}`);
      console.log(`      District: ${sample.district}`);
      console.log(`      Pincode: ${sample.pincode}`);
    });
    
    console.log('\n\n🎉 Import process completed successfully!');
    console.log('✨ Your location data is now ready for use!\n');
    
  } catch (error) {
    console.error('\n❌ Error during import:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed.');
  }
}

// Run the import
importToMongoDB();
