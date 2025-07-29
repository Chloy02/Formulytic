// frontend/src/lib/api/serverURL.js

const isProduction = process.env.NODE_ENV === 'production';

// Use the production URL from environment variables if it exists and is in production,
// otherwise, fall back to the local server URL.
const ServerLink = isProduction
  ? process.env.NEXT_PUBLIC_API_URL || 'https://formulytic-production.up.railway.app/api'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('ServerLink Configuration:', {
  isProduction,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  ServerLink
});

export default ServerLink;