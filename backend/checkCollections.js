const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

async function checkCollections() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📂 Database Collections:');
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`  - ${col.name}: ${count} documents`);
    }
    
    // Test direct query on responses collection
    console.log('\n🔍 Direct query on responses collection:');
    const directQuery = await mongoose.connection.db.collection('responses').find({}).toArray();
    console.log(`Found ${directQuery.length} documents via direct query`);
    
    if (directQuery.length > 0) {
      console.log('First document:', JSON.stringify(directQuery[0], null, 2));
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkCollections();
