"use client";

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Fade } from 'react-awesome-reveal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar2 from '../components/Navbar2';
import { useAuth } from '../contexts/AuthContext';
import KarnatakaMap from '../components/KarnatakaMap';
// import QuestionComponent from './QuestionComponent/QuestionComponent';
// import QuestionnairePage from './QuestionComponent/QuestionnairePage';

// --- Styled Components ---

const LandingPageContainer = styled.div`
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8faff;
  color: #333;
  width: 100%;
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 60px 30px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
  gap: 60px;

  @media (max-width: 1024px) {
    gap: 40px;
    padding: 50px 25px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 30px 20px;
    gap: 40px;
    position: relative;
    min-height: auto;
  }

  @media (max-width: 480px) {
    padding: 20px 15px;
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
    z-index: 2;
    position: relative;
    width: 100%;
    max-width: 100%;
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
    z-index: 2;
    position: relative;
    width: 100%;
    max-width: 100%;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 30px;
  margin-bottom: 30px;
  margin-left: 20px;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 25px;
    margin-bottom: 25px;
    margin-left: 0;
  }

  @media (max-width: 480px) {
    gap: 20px;
    margin-bottom: 20px;
  }
`;

const LogoImage = styled.img`
  height: 80px;
  width: auto;
  object-fit: contain;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    filter: drop-shadow(0 0 15px rgba(0, 123, 255, 0.6)) drop-shadow(0 0 25px rgba(0, 123, 255, 0.4));
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    height: 70px;
  }

  @media (max-width: 480px) {
    height: 60px;
  }

  @media (max-width: 360px) {
    height: 50px;
  }
`;

const MainHeading = styled.h1`
  font-size: 56px;
  font-weight: 800;
  color: #1a202c;
  line-height: 1.2;
  margin-bottom: 20px;
  max-width: 100%;
  word-wrap: break-word;

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
  color: #007bff;
`;

const SubText = styled.p`
  font-size: 18px;
  color: #555;
  max-width: 700px;
  margin-bottom: 40px;
  line-height: 1.6;
  padding: 0 15px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 35px;
    padding: 0 10px;
    line-height: 1.7;
  }

  @media (max-width: 480px) {
    font-size: 15px;
    margin-bottom: 30px;
    padding: 0 5px;
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
    max-width: 100%;
    margin-bottom: 35px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 30px;
  }
`;

const PrimaryButton = styled(Link)`
  background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
  color: white;
  padding: 18px 35px;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(30, 58, 138, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    margin-left: 12px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(3px);
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

const SecondaryButton = styled(Link)`
  background-color: transparent;
  color: #6b7280;
  padding: 16px 30px;
  font-size: 16px;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 2px solid #d1d5db;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
    color: #374151;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 25px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 14px;
  }
`;

const FeatureList = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  padding: 0 30px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    padding: 0 20px;
    align-items: center;
  }

  @media (max-width: 480px) {
    gap: 15px;
    padding: 0 15px;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #555;
  font-weight: 500;
  white-space: nowrap;

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
  }
`;

const HeroVisual = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 500px;

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    max-width: 100%;
    z-index: 1;
    opacity: 1;
    margin-top: 20px;
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

const GradientBackground = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%);
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
`;

export default function Home() {
  const { isLoggedIn, user } = useAuth();
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

  return (
    <>
      <GradientBackground />
      <LandingPageContainer style={{ position: 'relative', zIndex: 1 }}>
        <Navbar2 />

        <Fade triggerOnce={true} direction="up">
          <HeroSection>
            <HeroContent>
              <LogoContainer>
                <LogoImage src="/images/christ.svg" alt="Christ University Logo" />
                <LogoImage src="/images/Seal_of_Karnataka.svg" alt="Government of Karnataka Seal" />
              </LogoContainer>
              <MainHeading style={{ textShadow: '0 2px 8px rgba(30,64,175,0.08)' }}>
                Karnataka Social <HighlightText>Impact</HighlightText> Evaluation Survey
              </MainHeading>
              <SubText style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 12, boxShadow: '0 2px 8px rgba(30,64,175,0.04)', padding: '18px 18px', marginBottom: 32 }}>
                Help us evaluate the effectiveness of government welfare schemes for inter-caste marriages and community development programs in Karnataka. 
                Your responses will contribute to improving social equity and integration across beneficiary communities.
              </SubText>
              <HeroButtons>
                <PrimaryButton href='/questionnaire'>
                  Start Questionnaire
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                  </svg>
                </PrimaryButton>
                {!isLoggedIn && (
                  <SecondaryButton href="/signin">Already Registered? Sign In</SecondaryButton>
                )}
              </HeroButtons>
              <FeatureList style={{ background: 'rgba(255,255,255,0.8)', borderRadius: 10, boxShadow: '0 2px 8px rgba(30,64,175,0.04)', padding: '18px 0', marginTop: 8 }}>
                <FeatureItem>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.75.75 0 0 1 .054 1.06L7.208 11.45a.75.75 0 0 1-1.06 0L3.25 8.56a.75.75 0 0 1 1.06-1.06l2.12 2.12L11.626 4.024a.75.75 0 0 1 1.11-.054z" />
                  </svg>
                  Quick & easy to complete
                </FeatureItem>
                <FeatureItem>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.75.75 0 0 1 .054 1.06L7.208 11.45a.75.75 0 0 1-1.06 0L3.25 8.56a.75.75 0 0 1 1.06-1.06l2.12 2.12L11.626 4.024a.75.75 0 0 1 1.11-.054z" />
                  </svg>
                  Your data is secure
                </FeatureItem>
                <FeatureItem>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.75.75 0 0 1 .054 1.06L7.208 11.45a.75.75 0 0 1-1.06 0L3.25 8.56a.75.5 0 0 1 1.06-1.06l2.12 2.12L11.626 4.024a.75.75 0 0 1 1.11-.054z" />
                  </svg>
                  Progress is saved
                </FeatureItem>
              </FeatureList>
            </HeroContent>
            <HeroVisual>
              <KarnatakaMapContainer>
                <img src="/images/Karnataka_districts_map.svg" alt="Karnataka Map" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </KarnatakaMapContainer>
            </HeroVisual>
          </HeroSection>
        </Fade>

        {/* Optionally, you can add more sections or info here */}
      </LandingPageContainer>
    </>
  );
}
