const mongoose = require('mongoose');
const Response = require('./models/responseModel');
require('dotenv').config({ path: __dirname + '/.env' });

async function debugResponseModel() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    console.log('\n🔍 Testing Response.find({}) query:');
    const responses = await Response.find({});
    console.log(`Found ${responses.length} responses using Mongoose model`);
    
    if (responses.length === 0) {
      console.log('\n❌ Mongoose model returns empty array');
      console.log('🔍 Let\'s debug the model...');
      
      // Check model collection name
      console.log('Model collection name:', Response.collection.name);
      
      // Try querying with different conditions
      console.log('\n🔍 Trying different queries:');
      
      const allDocs = await Response.find({}).lean();
      console.log(`find({}).lean(): ${allDocs.length} results`);
      
      const submittedOnly = await Response.find({ status: 'submitted' });
      console.log(`find({status: 'submitted'}): ${submittedOnly.length} results`);
      
      const draftOnly = await Response.find({ status: 'draft' });
      console.log(`find({status: 'draft'}): ${draftOnly.length} results`);
      
      // Check if there are validation errors
      console.log('\n🔍 Checking model validation:');
      try {
        const testDoc = new Response({
          submittedBy: new mongoose.Types.ObjectId(),
          status: 'draft',
          answers: { test: 'data' }
        });
        const validationResult = testDoc.validateSync();
        if (validationResult) {
          console.log('Validation errors:', validationResult.errors);
        } else {
          console.log('No validation errors');
        }
      } catch (err) {
        console.log('Model creation error:', err.message);
      }
      
      // Direct collection query
      console.log('\n🔍 Direct collection query:');
      const directResults = await mongoose.connection.db.collection('responses').find({}).toArray();
      console.log(`Direct query: ${directResults.length} results`);
      
      if (directResults.length > 0) {
        console.log('First direct result structure:');
        console.log(Object.keys(directResults[0]));
      }
      
    } else {
      console.log('✅ Mongoose model working correctly!');
      console.log('First response:', responses[0]);
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugResponseModel();
