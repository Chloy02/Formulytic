"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { theme } from '@/styles/theme';
import { 
  Button, 
  Heading, 
  Text, 
  Container, 
  Stack
} from '@/components/ui';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import { 
  ArrowRight, 
  Sparkles
} from 'lucide-react';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #f1f5f9 100%);
  display: flex;
  flex-direction: column;

  .dark & {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }
`;

const HeroSection = styled.section`
  padding: 6rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
`;

const HeroContent = styled(Container)`
  position: relative;
  z-index: 1;
`;

const BadgeWrapper = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  border: 1px solid #bfdbfe;

  .dark & {
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
    color: #60a5fa;
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const HeroTitle = styled(Heading)`
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;

  .dark & {
    background: linear-gradient(135deg, #f1f5f9 0%, #60a5fa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const HeroSubtitle = styled(Text)`
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const CTASection = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const HomePage: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { t } = useTranslation(); // Translation hook
  const router = useRouter();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      if (user?.role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/questionnaire');
      }
    } else {
      router.push('/signup');
    }
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  return (
    <PageWrapper>
      <EnhancedNavbar />
      
      <HeroSection>
        <HeroBackground />
        <HeroContent maxWidth="lg">
          <BadgeWrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles size={16} />
            <span>{t('Revolutionizing Data Collection')}</span>
          </BadgeWrapper>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <HeroTitle>
              {t('Transform Your Data Collection with Formulytic')}
            </HeroTitle>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HeroSubtitle size="lg" color="secondary">
              {t('Create intelligent questionnaires, gather valuable insights, and make data-driven decisions with our powerful, easy-to-use platform designed for modern teams.')}
            </HeroSubtitle>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CTASection>
              <Button
                size="lg"
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Stack direction="row" spacing="sm" align="center">
                  <span>{isLoggedIn ? t('Go to Dashboard') : t('Get Started Free')}</span>
                  <ArrowRight size={20} />
                </Stack>
              </Button>
            </CTASection>
          </motion.div>
        </HeroContent>
      </HeroSection>
    </PageWrapper>
  );
};

export default HomePage;
