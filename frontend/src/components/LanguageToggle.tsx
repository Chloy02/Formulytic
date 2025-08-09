"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from '@/contexts/TranslationContext';
import { useRouter, usePathname } from 'next/navigation';
import { theme } from '@/styles/theme';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const ToggleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const LanguageLabel = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active: boolean }>`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${props => props.active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  color: ${props => props.active ? theme.colors.primary[600] : theme.colors.text.secondary};
  transition: all 0.2s ease;
  user-select: none;
  cursor: pointer;

  .dark & {
    color: ${props => props.active ? '#60a5fa' : '#94a3b8'};
  }

  &:hover {
    color: ${theme.colors.primary[500]};

    .dark & {
      color: #93c5fd;
    }
  }
`;

const SwitchContainer = styled.button`
  position: relative;
  width: 52px;
  height: 28px;
  border-radius: 14px;
  border: 2px solid ${theme.colors.border.light};
  background: ${theme.colors.background.secondary};
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  overflow: hidden;

  &:focus {
    box-shadow: 0 0 0 2px ${theme.colors.primary[100]};
  }

  &:hover {
    border-color: ${theme.colors.primary[300]};
  }

  .dark & {
    background: #1e293b;
    border-color: #334155;

    &:focus {
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    &:hover {
      border-color: #60a5fa;
    }
  }
`;

const SwitchThumb = styled(motion.div)<{ isKannada: boolean }>`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: white;
  box-shadow: ${theme.shadows.sm};

  .dark & {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }
`;

const LoadingIndicator = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border: 2px solid transparent;
  border-top: 2px solid ${theme.colors.primary[400]};
  border-radius: 50%;
`;

export default function LanguageToggle() {
  const { language, setLanguage, isLoading } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  
  const isKannada = language === 'kn';

  const handleToggle = () => {
    if (!isLoading) {
      const newLang = isKannada ? 'en' : 'kn';
      
      // Handle navigation for questionnaire pages
      if (pathname.includes('/questionnaire-complete') || pathname.includes('/questionnaire-kannada')) {
        if (newLang === 'kn') {
          router.push('/questionnaire-kannada');
        } else {
          router.push('/questionnaire-complete');
        }
        // Set language after navigation to prevent double redirect
        setTimeout(() => setLanguage(newLang), 100);
      } else {
        setLanguage(newLang);
      }
    }
  };

  const handleLabelClick = (lang: 'en' | 'kn') => {
    if (!isLoading && language !== lang) {
      
      // Handle navigation for questionnaire pages
      if (pathname.includes('/questionnaire-complete') || pathname.includes('/questionnaire-kannada')) {
        if (lang === 'kn') {
          router.push('/questionnaire-kannada');
        } else {
          router.push('/questionnaire-complete');
        }
        // Set language after navigation to prevent double redirect
        setTimeout(() => setLanguage(lang), 100);
      } else {
        setLanguage(lang);
      }
    }
  };

  return (
    <ToggleContainer>
      <LanguageLabel 
        active={!isKannada} 
        onClick={() => handleLabelClick('en')}
      >
        EN
      </LanguageLabel>
      
      <ToggleWrapper>
        <SwitchContainer
          onClick={handleToggle}
          disabled={isLoading}
          aria-label={`Switch to ${isKannada ? 'English' : 'Kannada'}`}
        >
          <SwitchThumb
            isKannada={isKannada}
            animate={{ 
              x: isKannada ? 24 : 0,
              scale: isLoading ? 0.8 : 1
            }}
            transition={{ 
              type: 'spring',
              stiffness: 500,
              damping: 30
            }}
          >
            {isLoading ? (
              <LoadingIndicator
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: 'linear' 
                }}
              />
            ) : (
              <span>{isKannada ? 'ಕ' : 'E'}</span>
            )}
          </SwitchThumb>
        </SwitchContainer>
      </ToggleWrapper>
      
      <LanguageLabel 
        active={isKannada} 
        onClick={() => handleLabelClick('kn')}
      >
        ಕನ್ನಡ
      </LanguageLabel>
    </ToggleContainer>
  );
}
