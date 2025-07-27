export const theme = {
  colors: {
    primary: {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      blue: '#667eea',
      purple: '#764ba2'
    },
    secondary: {
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
      pink: '#f093fb',
      red: '#f5576c'
    },
    success: {
      gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      green: '#43e97b',
      cyan: '#38f9d7'
    },
    info: {
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      blue: '#4facfe',
      cyan: '#00f2fe'
    },
    warning: {
      gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
      pink: '#fa709a',
      yellow: '#fee140'
    },
    neutral: {
      gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
      teal: '#a8edea',
      pink: '#fed6e3'
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      muted: '#9ca3af'
    },
    background: {
      white: '#ffffff',
      glass: 'rgba(255, 255, 255, 0.95)',
      light: '#f8fafc',
      border: 'rgba(255, 255, 255, 0.2)'
    },
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      focus: '#667eea'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '15px',
    xl: '20px'
  },
  shadows: {
    sm: '0 5px 15px rgba(0, 0, 0, 0.08)',
    md: '0 10px 30px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 40px rgba(0, 0, 0, 0.1)',
    focus: '0 0 0 4px rgba(102, 126, 234, 0.1)'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }
};

export type Theme = typeof theme;
