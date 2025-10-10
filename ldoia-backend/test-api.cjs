/**
 * Test India Post Office API for Taluka Data
 * Tests a few sample pincodes to verify the API works correctly
 */

const https = require('https');

const TEST_PINCODES = [
  '400102', // Mumbai Suburban - Andheri
  '110001', // Delhi - Central Delhi
  '560001', // Bangalore
  '600001', // Chennai
  '700001', // Kolkata
  '400049', // Mumbai Suburban - Juhu
  '400052', // Mumbai Suburban - Khar
  '305001', // Rajasthan - Ajmer
];

function fetchPincodeData(pincode) {
  return new Promise((resolve) => {
    const url = `https://api.postalpincode.in/pincode/${pincode}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json[0]?.Status === 'Success' && json[0]?.PostOffice?.length > 0) {
            const po = json[0].PostOffice[0];
            resolve({
              pincode,
              taluka: po.Block || po.Taluk || po.Tehsil || 'N/A',
              district: po.District || 'N/A',
              state: po.State || 'N/A',
              division: po.Division || 'N/A',
              region: po.Region || 'N/A'
            });
          } else {
            resolve({ pincode, error: json[0]?.Message || 'Not found' });
          }
        } catch (error) {
          resolve({ pincode, error: error.message });
        }
      });
    }).on('error', (error) => {
      resolve({ pincode, error: error.message });
    });
  });
}

async function testAPI() {
  console.log('🧪 Testing India Post Office API\n');
  console.log('API: https://api.postalpincode.in\n');
  console.log('=' .repeat(80) + '\n');

  for (const pincode of TEST_PINCODES) {
    const result = await fetchPincodeData(pincode);
    
    if (result.error) {
      console.log(`❌ Pincode ${pincode}: ${result.error}`);
    } else {
      console.log(`✅ Pincode ${pincode}:`);
      console.log(`   Taluka: ${result.taluka}`);
      console.log(`   District: ${result.district}`);
      console.log(`   State: ${result.state}`);
      console.log(`   Division: ${result.division}`);
    }
    console.log('');
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('=' .repeat(80));
  console.log('\n✅ API Test Complete!\n');
  console.log('If you see taluka data above, the API is working correctly.');
  console.log('You can now run: node fetch-taluka-from-api.cjs\n');
}

testAPI();
