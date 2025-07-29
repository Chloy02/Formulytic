// frontend/src/lib/api/serverURL.js

const isProduction = process.env.NODE_ENV === 'production';

// Use the production URL from environment variables if it exists and is in production,
// otherwise, fall back to the local server URL.
const ServerLink = isProduction
  ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  : 'http://localhost:5000/api';

export default ServerLink;