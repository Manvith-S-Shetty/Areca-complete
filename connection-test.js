// Simple script to test if frontend can reach backend
async function testConnection() {
  try {
    console.log('Testing connection to backend...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://127.0.0.1:8787/api/health');
    console.log('Health endpoint status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health data:', healthData);
      console.log('✅ Backend connection successful!');
    } else {
      console.log('❌ Backend health check failed with status:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
    console.log('This might mean:');
    console.log('1. Backend server is not running');
    console.log('2. Backend is running on a different port');
    console.log('3. Network/firewall issues');
  }
}

testConnection();