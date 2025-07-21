"use client";

import React from 'react';
import styled from 'styled-components';
import { Fade, Slide } from 'react-awesome-reveal';
import Link from 'next/link';
import Navbar2 from '../components/Navbar2';

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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 60px 30px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 40px 15px;
  }
`;

const Tagline = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #e0f2ff;
  color: #007bff;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 12px;
    margin-bottom: 15px;
  }

  svg {
    margin-right: 8px;
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
    font-size: 36px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 28px;
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
    margin-bottom: 30px;
    padding: 0;
  }

  @media (max-width: 480px) {
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
    max-width: 300px;
  }
`;

const PrimaryButton = styled(Link)`
  background-color: #007bff;
  color: #fff;
  padding: 15px 30px;
  font-size: 18px;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  svg {
    margin-left: 10px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 25px;
    font-size: 16px;
  }
`;

const SecondaryButton = styled(Link)`
  background-color: #e9ecef;
  color: #333;
  padding: 15px 30px;
  font-size: 18px;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #dee2e6;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 25px;
    font-size: 16px;
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
  }

  svg {
    color: #28a745;
    margin-right: 8px;
    font-size: 20px;
  }
`;

export default function Home() {
  return (
    <LandingPageContainer>
      <Navbar2 />

      <Fade triggerOnce={true} direction="down">
        <HeroSection>
          <Tagline>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5.5 4a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V4.5a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V4.5a.5.5 0 0 1 .5-.5zM12 9H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"/>
            </svg>
            Smart Questionnaire Platform
          </Tagline>
          <MainHeading>
            SCSP/TSP <HighlightText>Impact</HighlightText> Evaluation Questionnaire
          </MainHeading>
          <SubText>
            Impact Evaluation of SCSP/TSP Incentive Schemes for Inter-Caste Marriages and Other Schemes in Karnataka.
            Assessing their effectiveness in promoting social equity and integration across beneficiary communities.
          </SubText>
          <HeroButtons>
            <PrimaryButton href='/questionnaire'>
              Start Questionnaire
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
            </PrimaryButton>
            <SecondaryButton href="/signin">Sign In</SecondaryButton>
          </HeroButtons>
          <FeatureList>
            <FeatureItem>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.736 3.97a.75.75 0 0 1 .054 1.06L7.208 11.45a.75.75 0 0 1-1.06 0L3.25 8.56a.75.75 0 0 1 1.06-1.06l2.12 2.12L11.626 4.024a.75.75 0 0 1 1.11-.054z"/>
              </svg>
              Quick & easy to complete
            </FeatureItem>
            <FeatureItem>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.736 3.97a.75.75 0 0 1 .054 1.06L7.208 11.45a.75.75 0 0 1-1.06 0L3.25 8.56a.75.75 0 0 1 1.06-1.06l2.12 2.12L11.626 4.024a.75.75 0 0 1 1.11-.054z"/>
              </svg>
              Your data is secure
            </FeatureItem>
            <FeatureItem>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.736 3.97a.75.75 0 0 1 .054 1.06L7.208 11.45a.75.75 0 0 1-1.06 0L3.25 8.56a.75.75 0 0 1 1.06-1.06l2.12 2.12L11.626 4.024a.75.75 0 0 1 1.11-.054z"/>
              </svg>
              Progress is saved
            </FeatureItem>
          </FeatureList>
        </HeroSection>
      </Fade>
    </LandingPageContainer>
  );
}
