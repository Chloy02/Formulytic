const mongoose = require('mongoose');
const Response = require('./models/responseModel');
require('dotenv').config({ path: __dirname + '/.env' });

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Count total documents
    const count = await Response.countDocuments();
    console.log(`📊 Total responses in database: ${count}`);
    
    // Get all responses
    const responses = await Response.find({});
    console.log(`📝 Found ${responses.length} responses:`);
    
    if (responses.length > 0) {
      responses.forEach((response, index) => {
        console.log(`\n--- Response ${index + 1} ---`);
        console.log('ID:', response._id);
        console.log('Status:', response.status);
        console.log('Submitted By:', response.submittedBy);
        console.log('Response ID:', response.responseId);
        console.log('Submission Date:', response.submissionDate);
        console.log('Answers:', JSON.stringify(response.answers, null, 2));
      });
    } else {
      console.log('❌ No responses found in database');
      console.log('\n🔍 Database Collections:');
      const collections = await mongoose.connection.db.listCollections().toArray();
      collections.forEach(col => console.log(`  - ${col.name}`));
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}

checkDatabase();
