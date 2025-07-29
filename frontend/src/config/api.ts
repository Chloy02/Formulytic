// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      ME: '/api/auth/me',
    },
    RESPONSES: {
      BASE: '/api/responses',
      DRAFT: '/api/responses/draft',
    },
    QUESTIONS: {
      BASE: '/api/questions',
    },
  },
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
