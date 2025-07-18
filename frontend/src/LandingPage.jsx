import React from 'react';
import styled from 'styled-components';
import { Fade, Slide } from 'react-awesome-reveal'; // Ensure these are imported if you want animations
import { Link } from 'react-router-dom'; // Crucial: Link must be imported
import Navbar2 from './components/Navbar2'; // Assuming your Navbar is in src/components/Navbar.jsx


// --- Styled Components ---

const LandingPageContainer = styled.div`
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8faff; /* Light background color for the page */
  color: #333;
  width: 100%;
  overflow-x: hidden; /* Prevent any potential horizontal scrollbar */
`;

const Button = styled.button` /* Generic Button, used for PrimaryButton if it doesn't navigate */
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 14px;
  }
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
  border-radius: 5px; /* Added for consistency, ensure it's there */
  font-weight: 600; /* Added for consistency, ensure it's there */
  cursor: pointer; /* Added for consistency, ensure it's there */
  display: inline-flex; /* Added for consistency to properly center content if needed */
  justify-content: center; /* Added for consistency */
  align-items: center; /* Added for consistency */

  // Add a transition for both background and transform for a smooth effect
  transition: background-color 0.3s ease, transform 0.3s ease; /* <<< ADDED transform to transition */

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05); /* <<< ADDED: Scales up by 5% on hover */
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

// CORRECTED: SecondaryButton now styled from Link
const SecondaryButton = styled(Link)`
  background-color: #e9ecef;
  color: #333;
  padding: 15px 30px;
  font-size: 18px;
  text-decoration: none; /* Remove default link underline */
  display: flex; /* To allow flex properties like justify-content/align-items if needed for internal content */
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

const FeaturesSection = styled.section`
  padding: 80px 30px;
  background-color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.03);

  @media (max-width: 768px) {
    padding: 50px 15px;
    gap: 30px;
  }
`;

const FeaturesHeading = styled.h2`
  font-size: 40px;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 15px;
  max-width: 800px;

  @media (max-width: 768px) {
    font-size: 30px;
    margin-bottom: 10px;
  }
`;

const FeaturesSubheading = styled.p`
  font-size: 18px;
  color: #555;
  max-width: 700px;
  line-height: 1.6;
  margin-bottom: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FeatureCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FeatureCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #eee;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    padding: 25px;
  }
`;

const FeatureIconWrapper = styled.div`
  background-color: #e0f2ff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;

  svg {
    color: #007bff;
    font-size: 24px;
  }
`;

const FeatureCardTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const FeatureCardDescription = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  margin: 0;
`;

const HowItWorksSection = styled.section`
  padding: 80px 30px;
  background-color: #f8faff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  @media (max-width: 768px) {
    padding: 50px 15px;
    gap: 30px;
  }
`;

const HowItWorksHeading = styled.h2`
  font-size: 40px;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 15px;
  max-width: 800px;

  @media (max-width: 768px) {
    font-size: 30px;
    margin-bottom: 10px;
  }
`;

const HowItWorksSubheading = styled.p`
  font-size: 18px;
  color: #555;
  max-width: 700px;
  line-height: 1.6;
  margin-bottom: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1000px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const StepCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
`;

const StepNumberCircle = styled.div`
  background-color: #e0f2ff;
  color: #007bff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  border: 2px solid #007bff;
`;

const StepTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const StepDescription = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.5;
  margin: 0;
`;

const CTABanner = styled.section`
  padding: 60px 30px;
  background-color: #28a745;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;

  @media (max-width: 768px) {
    padding: 40px 15px;
    gap: 20px;
  }
`;

const CTATitle = styled.h2`
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 10px;
  max-width: 800px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 30px;
    margin-bottom: 5px;
  }
`;

const CTASubtitle = styled.p`
  font-size: 18px;
  max-width: 700px;
  line-height: 1.6;
  margin-bottom: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const CTAPrimaryButton = styled(Link)` /* CHANGED: Now styled from Link */
  background-color: #fff;
  color: #28a745; /* Green text */
  padding: 15px 30px;
  font-size: 18px;
  text-decoration: none; 
  display: flex; /* To allow flex properties like justify-content/align-items for content */
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 25px;
    font-size: 16px;
  }
`;

// Corrected CTASecondaryButton:
const CTASecondaryButton = styled(Link)` /* CHANGED: Now styled from Link */
  background-color: transparent;
  color: #fff;
  border: 2px solid #fff;
  padding: 15px 30px;
  font-size: 18px;
  text-decoration: none; /* Crucial: Remove underline from Link */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 25px;
    font-size: 16px;
  }
`;

const FooterContainer = styled.footer`
  padding: 60px 30px;
  background-color: #f0f4f8;
  color: #555;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 40px 15px;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  max-width: 1200px;
  width: 100%;
  margin-bottom: 50px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 25px;
    text-align: center;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ColumnTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    margin-bottom: 5px;
  }
`;

const FooterLink = styled.a`
  text-decoration: none;
  color: #555;
  transition: color 0.3s ease;
  font-size: 16px;

  &:hover {
    color: #007bff;
  }
`;

const FooterBottom = styled.div`
  width: 100%;
  max-width: 1200px;
  padding-top: 30px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    padding-top: 20px;
  }
`;

const CopyrightText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #777;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;

const SocialIconLink = styled.a`
  color: #777;
  font-size: 24px;
  transition: color 0.3s ease;

  &:hover {
    color: #007bff;
  }

  svg {
    display: block;
  }
`;


const LandingPage = () => {
  return (
    <LandingPageContainer>
        <Navbar2 /> {/* This is the Navbar component from src/components/Navbar.jsx */}

      {/* Hero Section with Fade animation */}
      <Fade triggerOnce={true} direction="down">
        <HeroSection>
          <Tagline>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5.5 4a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V4.5a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V4.5a.5.5 0 0 1 .5-.5zM12 9H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"/>
            </svg>
            Smart Questionnaire Platform
          </Tagline>
          <MainHeading>
            SCSP/TSP <HighlightText> Impact </HighlightText> Evaluation Questionnaire
              
          </MainHeading>
          <SubText>
            Impact Evaluation of SCSP/TSP Incentive Schemes for Inter-Caste Marriages and Other Schemes in Karnataka.
             Assessing their effectiveness in promoting social equity and integration across beneficiary communities.
          </SubText>
          <HeroButtons>
            <PrimaryButton to='questionnaire' >
              Start Questionnaire
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
            </PrimaryButton>
            {/* CORRECTED: SecondaryButton now used as a Link to /signin */}
            <SecondaryButton to="/signin"> Sign In</SecondaryButton> 
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

      {/* Features Section with Slide animation from left */}
      <Slide triggerOnce={true} direction="left">
        <FeaturesSection>
          <FeaturesHeading>Powerful Questionnaire Features</FeaturesHeading>
          <FeaturesSubheading>
            Everything you need to create, distribute, and analyze questionnaires with professional-grade tools.
          </FeaturesSubheading>
          <FeatureCardsGrid>
            <FeatureCard>
              <FeatureIconWrapper>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                  <path d="M.047 11.071c.362.06.666.072 1.144.072h13.567c.478 0 .782-.012 1.144-.072L16 12.046V16H0v-3.954z"/>
                </svg>
              </FeatureIconWrapper>
              <FeatureCardTitle>Mobile Responsive</FeatureCardTitle>
              <FeatureCardDescription>
                Perfect experience across all devices with TailwindCSS design
              </FeatureCardDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconWrapper>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.5 13a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m-1.5 0a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0"/>
                  <path d="M1.398 8.441a15 15 0 0 0 7.6-.823c1.379-.345 2.63-1.095 3.633-2.062A4.5 4.5 0 0 0 14.5 2.5v-.217c-.889.356-1.78.688-2.671.996C9.284 4.887 6.402 5.516 3.42 5.516H.5c-.353 0-.5.225-.5.495v.49c.342.369.816.634 1.398.804ZM.42 11.7c-.353 0-.5.225-.5.495v.49c.342.369.816.634 1.398.804a15 15 0 0 0 7.6-.823c1.379-.345 2.63-1.095 3.633-2.062A4.5 4.5 0 0 0 14.5 9.5v-.217c-.889.356-1.78.688-2.671.996C9.284 11.887 6.402 12.516 3.42 12.516H.5c-.353 0-.5.225-.5.495v.49Z"/>
                </svg>
              </FeatureIconWrapper>
              <FeatureCardTitle>Secure Authentication</FeatureCardTitle>
              <FeatureCardDescription>
                User session tracking prevents duplicate submissions
              </FeatureCardDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconWrapper>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5zm.5-1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5z"/>
                  <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M1 3.857C1 3.342 1.333 3 1.745 3h12.51C14.666 3 15 3.342 15 3.857v1.4l-1.477 3.255C13.518 8.879 13.298 9 13 9s-.518-.121-.523-.129L11 6.822V4H5.5a.5.5 0 0 0-.5.5v7.5a.5.5 0 0 0 .5.5H13a.5.5 0 0 0 .5-.5V10h.5a.5.5 0 0 0 .5-.5v-4h-1Zm0 9.643V14h12V13.5a.5.5 0 0 0 .5-.5h-12a.5.5 0 0 0-.5.5"/>
                </svg>
              </FeatureIconWrapper>
              <FeatureCardTitle>Dual Questionnaires</FeatureCardTitle>
              <FeatureCardDescription>
                Two distinct questionnaire sets with progress indicators
              </FeatureCardDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIconWrapper>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="m8.934 6.13-.864.865V4.25a.75.75 0 0 0-1.5 0v2.745l-.864-.865a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l2.25-2.25a.75.75 0 0 0-1.06-1.06"/>
                </svg>
              </FeatureIconWrapper>
              <FeatureCardTitle>User-Friendly Interface</FeatureCardTitle>
              <FeatureCardDescription>
                Clean and intuitive design for easy questionnaire completion
              </FeatureCardDescription>
            </FeatureCard>

          </FeatureCardsGrid>
        </FeaturesSection>
      </Slide>

      {/* How It Works Section with Slide animation from right */}
      <Slide triggerOnce={true} direction="right">
        <HowItWorksSection>
          <HowItWorksHeading>How It Works</HowItWorksHeading>
          <HowItWorksSubheading>
            Simple three-step process to complete the questionnaires.
          </HowItWorksSubheading>
          <StepsGrid>
            <StepCard>
              <StepNumberCircle>1</StepNumberCircle>
              <StepTitle>Sign Up or Sign In</StepTitle>
              <StepDescription>
                Create an account or sign in to access the questionnaires
              </StepDescription>
            </StepCard>

            <StepCard>
              <StepNumberCircle>2</StepNumberCircle>
              <StepTitle>Complete Questions</StepTitle>
              <StepDescription>
                Answer questions in both questionnaire sets at your own pace
              </StepDescription>
            </StepCard>

            <StepCard>
              <StepNumberCircle>3</StepNumberCircle>
              <StepTitle>Submit & Done</StepTitle>
              <StepDescription>
                Submit your responses and help us improve our services
              </StepDescription>
            </StepCard>
          </StepsGrid>
        </HowItWorksSection>
      </Slide>

      {/* CTA Banner Section with Fade animation */}
      <Fade triggerOnce={true} direction="up">
        <CTABanner>
          <CTATitle>Ready to Share Your Insights?</CTATitle>
          <CTASubtitle>
            Your responses matter. Help us understand your needs better by completing our questionnaires.
          </CTASubtitle>
          <CTAButtons>
            <CTAPrimaryButton to="/signup">Sign Up Now</CTAPrimaryButton>
            <CTASecondaryButton to="/signin">Sign In</CTASecondaryButton> {/* CORRECTED CLOSING TAG */}
          </CTAButtons>
        </CTABanner>
      </Fade>

      {/* Footer Section (no social icons) with Fade animation */}
      <Fade triggerOnce={true} direction="up">
        <FooterContainer>
          <FooterContent>
            <FooterColumn>
              <ColumnTitle>Platform</ColumnTitle>
              <FooterLink href="#">Questionnaires</FooterLink>
              <FooterLink href="#">Analytics</FooterLink>
              <FooterLink href="#">Export Data</FooterLink>
              <FooterLink href="#">API Access</FooterLink>
            </FooterColumn>

            <FooterColumn>
              <ColumnTitle>Features</ColumnTitle>
              <FooterLink href="#">Mobile Design</FooterLink>
              <FooterLink href="#">Real-time Analytics</FooterLink>
              <FooterLink href="#">CSV Export</FooterLink>
              <FooterLink href="#">Admin Portal</FooterLink>
            </FooterColumn>

            <FooterColumn>
              <ColumnTitle>Resources</ColumnTitle>
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">Help Center</FooterLink>
              <FooterLink href="#">Best Practices</FooterLink>
              <FooterLink href="#">Support</FooterLink>
            </FooterColumn>

            <FooterColumn>
              <ColumnTitle>Legal</ColumnTitle>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Data Security</FooterLink>
              <FooterLink href="#">GDPR Compliance</FooterLink>
            </FooterColumn>
          </FooterContent>

          <FooterBottom>
            <CopyrightText>&copy; 2025 Questionnaire Analytics Platform. All rights reserved.</CopyrightText>
            {/* Social media icons are intentionally removed here */}
          </FooterBottom>
        </FooterContainer>
      </Fade>
    </LandingPageContainer>
  );
};

export default LandingPage;