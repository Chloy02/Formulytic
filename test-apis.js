// Simple test to check if projects API is working
async function testProjectsAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/projects');
    const data = await response.json();
    console.log('Projects API Response:', data);
    
    if (response.ok) {
      console.log('✅ Projects API is working correctly');
      console.log('Projects returned:', data.projects);
    } else {
      console.log('❌ Projects API returned an error:', data);
    }
  } catch (error) {
    console.log('❌ Failed to call Projects API:', error);
  }
}

// Test login API with sample data
async function testLoginAPI() {
  try {
    const testData = {
      email: 'admin@formulytic.com',
      password: 'admin123',
      project: 'admin'
    };
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    console.log('Login API Response:', data);
    
    if (response.ok) {
      console.log('✅ Login API is working correctly');
    } else {
      console.log('❌ Login API returned an error:', data);
    }
  } catch (error) {
    console.log('❌ Failed to call Login API:', error);
  }
}

// Run tests
console.log('Testing APIs...');
testProjectsAPI();
setTimeout(() => {
  testLoginAPI();
}, 1000);
