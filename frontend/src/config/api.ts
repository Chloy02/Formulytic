// Import the unified server configuration
import ServerLink from '../lib/api/serverURL';

// API configuration
export const API_CONFIG = {
  BASE_URL: ServerLink,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
    },
    RESPONSES: {
      BASE: '/responses',
      DRAFT: '/responses/draft',
    },
    QUESTIONS: {
      BASE: '/questions',
    },
  },
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
