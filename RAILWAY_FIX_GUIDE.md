# Railway Deployment Fix Guide

## Issues Fixed

### 1. Admin Signup Bug
- **Problem**: Using undefined variables `username`, `email`, `password` instead of `formData.username`, etc.
- **Fix**: Updated to use `formData.username`, `formData.email`, `formData.password`
- **File**: `/frontend/src/app/admin-signup/page.tsx`

### 2. API Configuration
- **Problem**: Frontend not connecting to Railway backend URL
- **Fix**: Updated ServerLink configuration to use Railway URL
- **Files**: 
  - `/frontend/src/lib/api/serverURL.js`
  - `/frontend/.env.local`

### 3. User Model Updates
- **Problem**: User model missing username field and admin project support
- **Fix**: Added username field and 'admin' to project enum
- **File**: `/frontend/src/models/User.ts`

### 4. Draft Saving Bug
- **Problem**: Backend expecting `responseId` but frontend not sending it
- **Fix**: 
  - Frontend now generates responseId when saving drafts
  - Backend generates responseId if not provided
- **Files**: 
  - `/frontend/src/app/questionnaire-complete/page.tsx`
  - `/backend/controllers/responseController.js`

### 5. Response Array Handling
- **Problem**: Backend draft functions return arrays but controllers expected single objects
- **Fix**: Updated controllers to handle array responses properly
- **File**: `/backend/controllers/responseController.js`

### 6. Environment Variables
- **Problem**: Missing environment variables for production
- **Fix**: Created/updated .env files with Railway URLs and secrets
- **Files**: 
  - `/frontend/.env.local`
  - `/backend/.env`

## Railway Environment Variables Required

### Frontend Service (Formulytic Frontend)
```
NEXT_PUBLIC_API_URL=https://formulytic-production.up.railway.app/api
MONGO_URI=mongodb+srv://chloy:chloy2025@surveydb.wrbupcd.mongodb.net/formulytic_db?retryWrites=true&w=majority&appName=Surveydb
JWT_SECRET=a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1
NEXTAUTH_SECRET=a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1
NEXTAUTH_URL=https://formulytic.up.railway.app
```

### Backend Service (Formulytic_server)
```
MONGO_URI=mongodb+srv://chloy:chloy2025@surveydb.wrbupcd.mongodb.net/formulytic_db?retryWrites=true&w=majority&appName=Surveydb
JWT_SECRET=a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1
FRONTEND_URL=https://formulytic.up.railway.app
PORT=5000
NODE_ENV=production
```

## Testing Steps

1. **Admin Signup**: Try creating an admin account at `/admin-signup`
2. **Admin Login**: Test admin login at `/admin-login`  
3. **Draft Saving**: Test saving drafts in questionnaire
4. **Response Submission**: Test full questionnaire submission
5. **Admin Dashboard**: Verify admin can see responses

## Debugging Commands

If issues persist, check these in Railway logs:

### Frontend Logs
- Look for "ServerLink Configuration" log to verify API URL
- Check for authentication errors in browser network tab

### Backend Logs  
- Look for "Connected to MongoDB" success message
- Check for CORS errors if frontend can't connect
- Verify "Server running on port" message

## Common Issues

1. **CORS Errors**: Ensure FRONTEND_URL is set correctly in backend
2. **404 on API calls**: Verify NEXT_PUBLIC_API_URL is correct
3. **Database connection**: Check MONGO_URI format and credentials
4. **Authentication**: Ensure JWT_SECRET matches between frontend and backend

## Next Steps

1. Deploy updated code to Railway
2. Set environment variables as listed above
3. Test all functionality
4. Monitor logs for any remaining issues
