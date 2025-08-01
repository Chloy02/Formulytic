"use client";

import React, { useEffect } from 'react';
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
import KarnatakaMap from '@/components/KarnatakaMap';
import {
  ArrowRight,
  Sparkles
} from 'lucide-react';

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #f1f5f9 50%, #e0f2fe 100%);
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .dark & {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%);
    
    &::before {
      background-image: 
        radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.2) 0%, transparent 50%);
    }
  }
`;

const HeroSection = styled(motion.section)`
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      linear-gradient(45deg, transparent 40%, rgba(59, 130, 246, 0.03) 50%, transparent 60%),
      linear-gradient(-45deg, transparent 40%, rgba(139, 92, 246, 0.03) 50%, transparent 60%);
    animation: float 20s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes float {
    0%, 100% { transform: rotate(0deg) translateY(0); }
    50% { transform: rotate(180deg) translateY(-20px); }
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

const HeroContainer = styled(Container)`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 60px;
  max-width: 1400px;

  @media (max-width: 1024px) {
    gap: 40px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }

  @media (max-width: 480px) {
    gap: 30px;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
  max-width: 600px;

  @media (max-width: 768px) {
    text-align: center;
    width: 100%;
    max-width: 100%;
  }
`;

const HeroVisual = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 500px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    margin-top: 20px;
  }
`;

// Floating Christ University Logo (top-right)
const FloatingChristLogo = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }

  .dark & {
    background: rgba(30, 41, 59, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    top: 75px;
    right: 15px;
    padding: 6px;
  }

  @media (max-width: 480px) {
    top: 70px;
    right: 10px;
    padding: 4px;
  }
`;

const FloatingLogoImage = styled.img.attrs(() => ({
  width: 60,
  height: 60,
  alt: "Christ University Logo",
}))`
  height: 60px;
  width: 60px;
  object-fit: contain;
  transition: transform 0.3s ease, filter 0.3s ease;
  cursor: pointer;

  &:hover {
    filter: drop-shadow(0 0 15px rgba(0, 123, 255, 0.6)) drop-shadow(0 0 25px rgba(0, 123, 255, 0.4));
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 50px;
    width: 50px;
  }

  @media (max-width: 480px) {
    height: 40px;
    width: 40px;
  }
`;

// Centered Karnataka Logo Container
const CenteredLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const CenteredLogoImage = styled.img.attrs(() => ({
  width: 112,
  height: 112,
  alt: "Government of Karnataka Seal",
}))`
  height: 112px;
  width: 112px;
  object-fit: contain;
  transition: transform 0.3s ease, filter 0.3s ease;
  cursor: pointer;

  &:hover {
    filter: drop-shadow(0 0 15px rgba(0, 123, 255, 0.6)) drop-shadow(0 0 25px rgba(0, 123, 255, 0.4));
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 98px;
    width: 98px;
  }

  @media (max-width: 480px) {
    height: 84px;
    width: 84px;
  }

  @media (max-width: 360px) {
    height: 70px;
    width: 70px;
  }
`;

const MainHeading = styled(Heading)`
  font-size: 56px;
  font-weight: 800;
  color: #1a202c;
  line-height: 1.2;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #0f172a 0%, #2563eb 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  .dark & {
    background: linear-gradient(135deg, #f1f5f9 0%, #60a5fa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 1024px) {
    font-size: 48px;
  }

  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 20px;
    line-height: 1.3;
  }

  @media (max-width: 480px) {
    font-size: 26px;
    margin-bottom: 15px;
  }

  @media (max-width: 360px) {
    font-size: 24px;
  }
`;

const HighlightText = styled.span`
  color: #2563eb;
`;

const SubText = styled(Text)`
  font-size: 18px;
  max-width: 700px;
  margin-bottom: 40px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 35px;
    line-height: 1.7;
  }

  @media (max-width: 480px) {
    font-size: 15px;
    margin-bottom: 30px;
  }

  @media (max-width: 360px) {
    font-size: 14px;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    width: 100%;
    margin-bottom: 35px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 30px;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
  padding: 18px 35px;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 16px 30px;
    font-size: 16px;
    text-transform: none;
    letter-spacing: 0.2px;
  }

  @media (max-width: 480px) {
    padding: 14px 25px;
    font-size: 15px;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: #1f2937;
  border: 2px solid #d1d5db;
  font-weight: 600;

  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
    color: #111827;
  }

  .dark & {
    color: #f9fafb;
    border-color: #4b5563;
    
    &:hover {
      background-color: rgba(55, 65, 81, 0.1);
      border-color: #6b7280;
      color: #ffffff;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FeatureList = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #555;
  font-weight: 500;

  @media (max-width: 768px) {
    justify-content: center;
    font-size: 15px;
    padding: 8px 0;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 6px 0;
  }

  svg {
    color: #28a745;
    margin-right: 8px;
    font-size: 20px;
    flex-shrink: 0;

    @media (max-width: 480px) {
      font-size: 18px;
      margin-right: 6px;
    }
  }
`;

const KarnatakaMapContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: auto;
  
  svg {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 10px 25px rgba(0, 123, 255, 0.15));
  }

  @media (max-width: 768px) {
    max-width: 300px;
    
    svg {
      filter: none;
    }
  }
`;

const HomePage: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (isLoggedIn && user && user.role === 'admin') {
      router.push('/admin-dashboard');
    }
  }, [isLoggedIn, user, router]);

  // Don't render content for admin users (they'll be redirected)
  if (isLoggedIn && user && user.role === 'admin') {
    return null;
  }

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push('/questionnaire');
    } else {
      router.push('/signup');
    }
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  return (
    <PageWrapper>
      {/* Floating Christ University Logo */}
      <FloatingChristLogo>
        <a href="https://christuniversity.in" target="_blank" rel="noopener noreferrer">
          <FloatingLogoImage src="/images/christ.svg" alt="Christ University Logo" />
        </a>
      </FloatingChristLogo>

      <EnhancedNavbar />

      <HeroSection>
        <HeroBackground />
        <HeroContainer maxWidth="lg">
          <HeroContent>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <CenteredLogoContainer>
                <a href="https://karnataka.gov.in/english" target="_blank" rel="noopener noreferrer">
                  <CenteredLogoImage src="/images/Seal_of_Karnataka.svg" alt="Government of Karnataka Seal" />
                </a>
              </CenteredLogoContainer>

              <MainHeading>
                {t("Karnataka Social")} <HighlightText>{t("Impact")}</HighlightText> {t("Evaluation Survey")}
              </MainHeading>

              <SubText size="lg" color="secondary">
                {t("Help us evaluate the effectiveness of government welfare schemes for inter-caste marriages and community development programs in Karnataka. Your responses will contribute to improving social equity and integration across beneficiary communities.")}
              </SubText>

              <HeroButtons>
                <PrimaryButton
                  size="lg"
                  onClick={handleGetStarted}
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Stack direction="row" spacing="sm" align="center">
                    <span>{t("Start Questionnaire")}</span>
                    <ArrowRight size={16} />
                  </Stack>
                </PrimaryButton>

                {!isLoggedIn && (
                  <SecondaryButton
                    onClick={handleSignIn}
                    as={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("Already Registered? Sign In")}
                  </SecondaryButton>
                )}
              </HeroButtons>
            </motion.div>
          </HeroContent>

          <HeroVisual>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <KarnatakaMapContainer>
                <KarnatakaMap />
              </KarnatakaMapContainer>
            </motion.div>
          </HeroVisual>
        </HeroContainer>
      </HeroSection>
    </PageWrapper>
  );
};

export default HomePage;
