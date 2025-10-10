const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoURL = process.env.MONGODB_URI;
const dbName = mongoURL.split('/').pop().split('?')[0];

async function verifyLocationData() {
  const client = new MongoClient(mongoURL);
  
  try {
    console.log('🔌 Connecting to MongoDB Atlas...\n');
    await client.connect();
    console.log('✅ Connected successfully!\n');
    
    const db = client.db(dbName);
    const collection = db.collection('location_data');
    
    // Get total count
    const totalCount = await collection.countDocuments();
    console.log('📊 DATABASE STATISTICS:\n');
    console.log(`   ✅ Total location records: ${totalCount.toLocaleString()}\n`);
    
    // Get distinct counts
    const countries = await collection.distinct('country');
    console.log(`   Countries: ${countries.length}`);
    console.log(`   → ${countries.join(', ')}\n`);
    
    const zones = await collection.distinct('zone');
    const validZones = zones.filter(z => z && z !== 'Unknown');
    console.log(`   Zones: ${validZones.length}`);
    validZones.forEach(zone => console.log(`   → ${zone}`));
    console.log('');
    
    const states = await collection.distinct('state');
    console.log(`   States/UTs: ${states.length} total\n`);
    
    const districts = await collection.distinct('district');
    console.log(`   Districts: ${districts.length.toLocaleString()} unique districts\n`);
    
    const pincodes = await collection.distinct('pincode');
    console.log(`   Pincodes: ${pincodes.length.toLocaleString()} unique pincodes\n`);
    
    // Sample data from each zone
    console.log('📋 SAMPLE DATA BY ZONE:\n');
    for (const zone of validZones) {
      const sample = await collection.findOne({ zone });
      if (sample) {
        console.log(`   ${zone}:`);
        console.log(`   ├─ State: ${sample.state}`);
        console.log(`   ├─ District: ${sample.district}`);
        console.log(`   ├─ Pincode: ${sample.pincode}`);
        console.log(`   └─ Post Office: ${sample.postOffice}\n`);
      }
    }
    
    // Test API query patterns
    console.log('🔍 TEST QUERIES:\n');
    
    // Test 1: Get zones for India
    const indiaZones = await collection.distinct('zone', { country: 'India' });
    console.log(`   Query 1: Zones in India → ${indiaZones.filter(z => z !== 'Unknown').length} zones`);
    
    // Test 2: Get states for a specific zone
    const westernStates = await collection.distinct('state', { zone: 'Western India' });
    console.log(`   Query 2: States in Western India → ${westernStates.length} states`);
    
    // Test 3: Get districts for a state
    const maharashtraDistricts = await collection.distinct('district', { state: 'MAHARASHTRA' });
    console.log(`   Query 3: Districts in Maharashtra → ${maharashtraDistricts.length} districts`);
    
    // Test 4: Search by pincode
    const mumbaiPincode = await collection.find({ pincode: '400001' }).limit(3).toArray();
    console.log(`   Query 4: Post offices with pincode 400001 → ${mumbaiPincode.length} offices`);
    
    // Test 5: Complex filter
    const complexQuery = await collection.find({
      country: 'India',
      zone: 'North India',
      state: 'DELHI'
    }).limit(5).toArray();
    console.log(`   Query 5: Delhi offices → ${complexQuery.length} sample offices\n`);
    
    // Show indexes
    const indexes = await collection.indexes();
    console.log('🔍 INDEXES:\n');
    indexes.forEach(index => {
      const keys = Object.keys(index.key).join(', ');
      console.log(`   ✅ ${index.name}: { ${keys} }`);
    });
    
    console.log('\n\n🎉 VERIFICATION COMPLETE!\n');
    console.log('✨ Your location data is successfully imported and ready to use!');
    console.log('🌐 The data is now available in production MongoDB Atlas.\n');
    
  } catch (error) {
    console.error('\n❌ Verification error:', error);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed.');
  }
}

verifyLocationData();
