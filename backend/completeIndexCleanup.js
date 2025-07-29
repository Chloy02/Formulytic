const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

async function completeIndexCleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Check all collections
    console.log('\n📂 Checking all collections in database:');
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    
    // Focus on users collection
    if (collections.some(c => c.name === 'users')) {
      console.log('\n📋 Current indexes on users collection:');
      const indexes = await db.collection('users').indexes();
      indexes.forEach((index, i) => {
        console.log(`${i + 1}. ${index.name}:`, JSON.stringify(index.key));
      });
      
      // Drop all indexes except _id
      console.log('\n🗑️  Dropping all custom indexes...');
      for (const index of indexes) {
        if (index.name !== '_id_') {
          try {
            await db.collection('users').dropIndex(index.name);
            console.log(`✅ Dropped index: ${index.name}`);
          } catch (error) {
            console.log(`⚠️  Could not drop index ${index.name}:`, error.message);
          }
        }
      }
      
      // Recreate only the email index
      console.log('\n🔧 Creating email index...');
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('✅ Email index created');
      
      // Show final state
      console.log('\n📋 Final indexes on users collection:');
      const finalIndexes = await db.collection('users').indexes();
      finalIndexes.forEach((index, i) => {
        console.log(`${i + 1}. ${index.name}:`, JSON.stringify(index.key));
      });
      
      // Check for any existing records with null username
      console.log('\n🔍 Checking for records with null username...');
      const nullUsernameCount = await db.collection('users').countDocuments({ username: null });
      console.log(`Found ${nullUsernameCount} records with null username`);
      
      if (nullUsernameCount > 0) {
        console.log('🗑️  Removing username field from existing records...');
        await db.collection('users').updateMany(
          { username: { $exists: true } },
          { $unset: { username: "" } }
        );
        console.log('✅ Username field removed from existing records');
      }
      
    } else {
      console.log('ℹ️  No users collection found');
    }
    
    console.log('\n🎉 Complete index cleanup finished!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

completeIndexCleanup();
