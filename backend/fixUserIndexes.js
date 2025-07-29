const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

async function fixUserIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Check existing indexes on users collection
    console.log('\n📋 Current indexes on users collection:');
    const indexes = await db.collection('users').indexes();
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, JSON.stringify(index.key));
    });
    
    // Check if username index exists and drop it
    const usernameIndexExists = indexes.some(index => 
      index.key && index.key.username !== undefined
    );
    
    if (usernameIndexExists) {
      console.log('\n🗑️  Dropping username index...');
      try {
        await db.collection('users').dropIndex('username_1');
        console.log('✅ Username index dropped successfully');
      } catch (error) {
        console.log('ℹ️  Username index might not exist or already dropped:', error.message);
      }
    } else {
      console.log('\n✅ No username index found - database is clean');
    }
    
    // Show final indexes
    console.log('\n📋 Final indexes on users collection:');
    const finalIndexes = await db.collection('users').indexes();
    finalIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, JSON.stringify(index.key));
    });
    
    console.log('\n🎉 Database index cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixUserIndexes();
