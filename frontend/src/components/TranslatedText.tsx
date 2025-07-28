import React from 'react';
import { useAutoTranslate } from '../hooks/useDynamicTranslation';

interface TranslatedTextProps {
  children: string;
  fallback?: string;
  showLoading?: boolean;
  loadingText?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Component that automatically translates its text content
export const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  children, 
  fallback = children,
  showLoading = false,
  loadingText = '...',
  className,
  style
}) => {
  const { translatedText, loading } = useAutoTranslate(children);

  // Don't show loading for very short text to avoid UI flicker
  const shouldShowLoading = loading && showLoading && children.length > 5;

  if (shouldShowLoading) {
    return <span className={className} style={style}>{loadingText}</span>;
  }

  return (
    <span className={className} style={style}>
      {translatedText || fallback}
    </span>
  );
};

// Higher-order component to wrap any component with translation
export const withTranslation = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return React.forwardRef<any, P & { translateProps?: string[] }>((props, ref) => {
    const { translateProps = [], ...otherProps } = props;
    
    // For now, return the component as-is
    // This can be enhanced to automatically translate specific props
    return <WrappedComponent {...otherProps as P} ref={ref} />;
  });
};

// Utility component for translated labels
interface TranslatedLabelProps {
  text: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const TranslatedLabel: React.FC<TranslatedLabelProps> = ({ 
  text, 
  required = false, 
  className,
  style 
}) => {
  const { translatedText } = useAutoTranslate(text);

  return (
    <label className={className} style={style}>
      <TranslatedText>{text}</TranslatedText>
      {required && ' *'}
    </label>
  );
};

// Component for translated select options
interface TranslatedOptionProps {
  value: string;
  children: string;
}

export const TranslatedOption: React.FC<TranslatedOptionProps> = ({ value, children }) => {
  const { translatedText } = useAutoTranslate(children);

  return (
    <option value={value}>
      {translatedText}
    </option>
  );
};
