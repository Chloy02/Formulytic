const Response = require('./models/responseModel');

/**
 * Database cleanup utility to remove duplicate drafts
 * Each user should only have one draft at a time
 */
async function cleanupDuplicateDrafts() {
  try {
    console.log('Starting cleanup of duplicate drafts...');
    
    // Find all users who have drafts
    const usersWithDrafts = await Response.distinct('submittedBy', { status: 'draft' });
    console.log(`Found ${usersWithDrafts.length} users with draft responses`);
    
    let totalCleaned = 0;
    
    for (const userId of usersWithDrafts) {
      // Get all drafts for this user
      const userDrafts = await Response.find({
        submittedBy: userId,
        status: 'draft'
      }).sort({ updatedAt: -1, createdAt: -1 }); // Sort by most recent first
      
      if (userDrafts.length > 1) {
        console.log(`User ${userId} has ${userDrafts.length} drafts. Cleaning up...`);
        
        // Keep the most recent draft (first in sorted array)
        const keepDraft = userDrafts[0];
        
        // Delete the rest
        for (let i = 1; i < userDrafts.length; i++) {
          await Response.deleteOne({ _id: userDrafts[i]._id });
          totalCleaned++;
          console.log(`  Deleted draft ${userDrafts[i]._id} (older than ${keepDraft._id})`);
        }
      }
    }
    
    console.log(`✅ Cleanup completed. Removed ${totalCleaned} duplicate drafts.`);
    
    // Verify the results
    const remainingDrafts = await Response.countDocuments({ status: 'draft' });
    const usersWithDraftsAfter = await Response.distinct('submittedBy', { status: 'draft' });
    
    console.log(`📊 Final state: ${remainingDrafts} draft responses for ${usersWithDraftsAfter.length} users`);
    
    return {
      cleanedCount: totalCleaned,
      remainingDrafts: remainingDrafts,
      usersWithDrafts: usersWithDraftsAfter.length
    };
    
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}

// Add this as an exported function for reuse
async function preventDuplicateDrafts(userId) {
  try {
    const existingDrafts = await Response.find({
      submittedBy: userId,
      status: 'draft'
    }).sort({ updatedAt: -1, createdAt: -1 });
    
    if (existingDrafts.length > 1) {
      console.warn(`User ${userId} has ${existingDrafts.length} drafts. Cleaning up automatically...`);
      
      // Keep only the most recent
      for (let i = 1; i < existingDrafts.length; i++) {
        await Response.deleteOne({ _id: existingDrafts[i]._id });
        console.log(`Auto-deleted extra draft ${existingDrafts[i]._id} for user ${userId}`);
      }
      
      return existingDrafts[0]; // Return the kept draft
    }
    
    return existingDrafts[0] || null;
  } catch (error) {
    console.error('Error preventing duplicate drafts:', error);
    throw error;
  }
}

module.exports = {
  cleanupDuplicateDrafts,
  preventDuplicateDrafts
};

// If running this file directly, execute the cleanup
if (require.main === module) {
  const mongoose = require('mongoose');
  require('dotenv').config({ path: __dirname + '/.env' });
  
  async function runCleanup() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Connected to MongoDB');
      
      const result = await cleanupDuplicateDrafts();
      console.log('Cleanup result:', result);
      
      await mongoose.connection.close();
      console.log('✅ Database connection closed');
      process.exit(0);
    } catch (error) {
      console.error('Cleanup failed:', error);
      process.exit(1);
    }
  }
  
  runCleanup();
}
