const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoURL = process.env.MONGODB_URI;
const dbName = mongoURL.split('/').pop().split('?')[0];

console.log('🔄 Updating taluka field with division data...\n');

async function updateTalukaField() {
  const client = new MongoClient(mongoURL);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');
    
    const db = client.db(dbName);
    const collection = db.collection('location_data');
    
    // Update all documents: copy division to taluka
    console.log('📝 Copying division data to taluka field...');
    
    const result = await collection.updateMany(
      {},
      [
        {
          $set: {
            taluka: "$division"
          }
        }
      ]
    );
    
    console.log(`\n✅ Updated ${result.modifiedCount} records\n`);
    
    // Verify the update
    const sample = await collection.findOne({ taluka: { $ne: "" } });
    console.log('📋 Sample updated record:');
    console.log(`   Zone: ${sample.zone}`);
    console.log(`   State: ${sample.state}`);
    console.log(`   Division: ${sample.division}`);
    console.log(`   Taluka: ${sample.taluka} ✅`);
    console.log(`   District: ${sample.district}`);
    console.log(`   Pincode: ${sample.pincode}\n`);
    
    // Get distinct talukas
    const talukas = await collection.distinct('taluka');
    const nonEmptyTalukas = talukas.filter(t => t && t.trim());
    console.log(`📊 Total unique talukas: ${nonEmptyTalukas.length}\n`);
    
    // Show sample talukas by state
    console.log('📋 Sample talukas by state:\n');
    
    const states = ['MAHARASHTRA', 'DELHI', 'KARNATAKA', 'TAMIL NADU', 'GUJARAT'];
    for (const state of states) {
      const stateTalukas = await collection.distinct('taluka', { state });
      const validTalukas = stateTalukas.filter(t => t && t.trim());
      console.log(`   ${state}: ${validTalukas.length} talukas`);
      if (validTalukas.length > 0) {
        console.log(`   → ${validTalukas.slice(0, 3).join(', ')}...\n`);
      }
    }
    
    // Create index for taluka
    console.log('🔍 Creating index for taluka field...');
    await collection.createIndex({ taluka: 1 });
    console.log('✅ Index created successfully!\n');
    
    console.log('🎉 Update Complete!\n');
    console.log('✨ Taluka field is now populated and ready to use in your location filters!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed.');
  }
}

updateTalukaField();
