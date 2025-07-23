"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  color: #1a202c;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 20px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin: 20px 0;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #4299e1, #3182ce);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  margin-bottom: 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const SectionContent = styled.div`
  padding: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3748;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  color: #2d3748;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  option {
    color: #2d3748;
    background-color: white;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3748;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
  color: #2d3748;
  font-size: 0.95rem;

  &:hover {
    background-color: #f7fafc;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RadioItem = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
  color: #2d3748;
  font-size: 0.95rem;

  &:hover {
    background-color: #f7fafc;
  }
`;

const Radio = styled.input.attrs({ type: 'radio' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: space-between;
  margin-top: 30px;
  padding: 20px 30px;
  background-color: #f8f9fa;
  border-top: 1px solid #e2e8f0;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #4299e1;
          color: white;
          &:hover {
            background-color: #3182ce;
            transform: translateY(-1px);
          }
        `;
      case 'success':
        return `
          background-color: #48bb78;
          color: white;
          &:hover {
            background-color: #38a169;
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background-color: #e2e8f0;
          color: #4a5568;
          &:hover {
            background-color: #cbd5e0;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fed7d7;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 20px 0;
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  background-color: #c6f6d5;
  color: #2f855a;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 20px 0;
  font-weight: 500;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface FormData {
  section1: {
    respondentName: string;
    district: string;
    age: string;
    gender: string;
    education: string;
    employmentBefore: string;
    occupationBefore: string;
    incomeBefore: string;
    receivedBenefit: string;
    schemes: string[];
    otherBenefits: string;
    dateOfBenefit: string;
    utilization: string[];
    casteCategory: string;
    subCaste: string;
    tribeIdentity: string;
    marriageOpposed: string;
    relocated: string;
    aadhaarProvided: string;
  };
  section2: {
    occupationAfter: string;
    incomeAfter: string;
    socioEconomicStatusBefore: string;
    financialSecurityScale: string;
    spouseEmploymentAfter: string;
    socioEconomicStatusAfter: string;
    socialLifeImpact: string;
    fundDecisionMaker: string;
    financialDependencyReduced: string;
    startedNewLivelihood: string;
  };
  section3: {
    progressiveChangeScale: string;
    feltSociallyAccepted: string;
    discriminationReduction: string;
    feltMoreSecure: string;
    livingWithInLaws: string;
    inLawDiscrimination: string;
    inLawDiscriminationDetails: string;
    filedPoliceComplaint: string;
    supportFromNgosOrOfficials: string;
  };
  section4: {
    schemeAwarenessSource: string;
    officialsSupportive: string;
    applicationDifficulty: string;
    timeToReceiveBenefit: string;
    disbursementEffectiveness: string;
    awareOfSchemeDetails: string;
    applicationStatus: string;
    pendingDuration: string;
    rejectionReasonCommunicated: string;
    rejectionReason: string;
    qualityOfInformation: string;
  };
  section5: {
    schemeSuccessCasteDiscrimination: string;
    schemeSuccessSecurity: string;
    areasForImprovement: string[];
    shouldReviseIncentive: string;
    experiencedBenefits: string[];
    shouldContinueScheme: string;
    encourageIntercasteMarriage: string;
    schemeHelpedReduceDiscriminationInArea: string;
    futureSupportExpected: string[];
  };
  section6_DevadasiChildren: {
    childAgeAtMarriage: string;
    schemeImprovedDignity: string;
    treatmentDifference: string;
    spouseCaste: string;
    ownsPropertyNow: string;
    inLawAcceptabilityScale: string;
    facedStigma: string;
  };
}

export default function QuestionnairePage() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    section1: {
      respondentName: '',
      district: '',
      age: '',
      gender: '',
      education: '',
      employmentBefore: '',
      occupationBefore: '',
      incomeBefore: '',
      receivedBenefit: '',
      schemes: [],
      otherBenefits: '',
      dateOfBenefit: '',
      utilization: [],
      casteCategory: '',
      subCaste: '',
      tribeIdentity: '',
      marriageOpposed: '',
      relocated: '',
      aadhaarProvided: '',
    },
    section2: {
      occupationAfter: '',
      incomeAfter: '',
      socioEconomicStatusBefore: '',
      financialSecurityScale: '',
      spouseEmploymentAfter: '',
      socioEconomicStatusAfter: '',
      socialLifeImpact: '',
      fundDecisionMaker: '',
      financialDependencyReduced: '',
      startedNewLivelihood: '',
    },
    section3: {
      progressiveChangeScale: '',
      feltSociallyAccepted: '',
      discriminationReduction: '',
      feltMoreSecure: '',
      livingWithInLaws: '',
      inLawDiscrimination: '',
      inLawDiscriminationDetails: '',
      filedPoliceComplaint: '',
      supportFromNgosOrOfficials: '',
    },
    section4: {
      schemeAwarenessSource: '',
      officialsSupportive: '',
      applicationDifficulty: '',
      timeToReceiveBenefit: '',
      disbursementEffectiveness: '',
      awareOfSchemeDetails: '',
      applicationStatus: '',
      pendingDuration: '',
      rejectionReasonCommunicated: '',
      rejectionReason: '',
      qualityOfInformation: '',
    },
    section5: {
      schemeSuccessCasteDiscrimination: '',
      schemeSuccessSecurity: '',
      areasForImprovement: [],
      shouldReviseIncentive: '',
      experiencedBenefits: [],
      shouldContinueScheme: '',
      encourageIntercasteMarriage: '',
      schemeHelpedReduceDiscriminationInArea: '',
      futureSupportExpected: [],
    },
    section6_DevadasiChildren: {
      childAgeAtMarriage: '',
      schemeImprovedDignity: '',
      treatmentDifference: '',
      spouseCaste: '',
      ownsPropertyNow: '',
      inLawAcceptabilityScale: '',
      facedStigma: '',
    },
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    if (user && user.role === 'admin') {
      router.push('/admin-dashboard');
      return;
    }

    // Load draft if exists
    loadDraft();
  }, [isLoggedIn, user, router]);

  const loadDraft = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/responses/draft', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data) {
        setFormData(response.data.answers);
        setSuccess('Draft loaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      // No draft found, continue with empty form
      console.log('No draft found');
    }
  };

  const handleInputChange = (section: keyof FormData, field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleCheckboxChange = (section: keyof FormData, field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = (prev[section] as any)[field] as string[] || [];
      const newArray = checked
        ? [...currentArray, value]
        : currentArray.filter((item: string) => item !== value);
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray,
        },
      };
    });
  };

  const saveDraft = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/responses/draft', 
        { answers: formData },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess('Draft saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError('Failed to save draft. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/responses', 
        { answers: formData },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess('Response submitted successfully!');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      setError('Failed to submit response. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const nextSection = () => {
    if (currentSection < 6) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const backToHome = () => {
    router.push('/');
  };

  const progress = (currentSection / 6) * 100;

  if (!isLoggedIn) {
    return null;
  }

  return (
    <PageContainer>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <Button 
            variant="secondary" 
            onClick={backToHome}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            ← Back to Home
          </Button>
          <div></div>
        </div>
        <Title>SCSP/TSP Impact Evaluation Questionnaire</Title>
        <Subtitle>Your responses will help us improve these important social programs</Subtitle>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        <div>Section {currentSection} of 6</div>
      </Header>

      <FormContainer>
        {/* Section 1: Basic Information */}
        {currentSection === 1 && (
          <>
            <SectionHeader>
              <SectionTitle>Section 1: Basic Information & Demographics</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FormGroup>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={formData.section1.respondentName}
                  onChange={(e) => handleInputChange('section1', 'respondentName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </FormGroup>

              <FormGroup>
                <Label>District/Taluk</Label>
                <Input
                  type="text"
                  value={formData.section1.district}
                  onChange={(e) => handleInputChange('section1', 'district', e.target.value)}
                  placeholder="Enter your district and taluk"
                />
              </FormGroup>

              <FormGroup>
                <Label>Age</Label>
                <Input
                  type="number"
                  value={formData.section1.age}
                  onChange={(e) => handleInputChange('section1', 'age', e.target.value)}
                  placeholder="Enter your age"
                />
              </FormGroup>

              <FormGroup>
                <Label>Gender</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="gender"
                      value="male"
                      checked={formData.section1.gender === 'male'}
                      onChange={(e) => handleInputChange('section1', 'gender', e.target.value)}
                    />
                    Male
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="gender"
                      value="female"
                      checked={formData.section1.gender === 'female'}
                      onChange={(e) => handleInputChange('section1', 'gender', e.target.value)}
                    />
                    Female
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="gender"
                      value="other"
                      checked={formData.section1.gender === 'other'}
                      onChange={(e) => handleInputChange('section1', 'gender', e.target.value)}
                    />
                    Other
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Education Level</Label>
                <Select
                  value={formData.section1.education}
                  onChange={(e) => handleInputChange('section1', 'education', e.target.value)}
                >
                  <option value="">Select education level</option>
                  <option value="below_8th">Below 8th Standard</option>
                  <option value="up_to_12th">Up to 12th Standard</option>
                  <option value="graduation">Graduation</option>
                  <option value="post_graduation">Post Graduation</option>
                  <option value="others">Others</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Were you employed before receiving the scheme benefits?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="employmentBefore"
                      value="yes"
                      checked={formData.section1.employmentBefore === 'yes'}
                      onChange={(e) => handleInputChange('section1', 'employmentBefore', e.target.value)}
                    />
                    Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="employmentBefore"
                      value="no"
                      checked={formData.section1.employmentBefore === 'no'}
                      onChange={(e) => handleInputChange('section1', 'employmentBefore', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              {formData.section1.employmentBefore === 'yes' && (
                <FormGroup>
                  <Label>What was your occupation before?</Label>
                  <Input
                    type="text"
                    value={formData.section1.occupationBefore}
                    onChange={(e) => handleInputChange('section1', 'occupationBefore', e.target.value)}
                    placeholder="Enter your previous occupation"
                  />
                </FormGroup>
              )}

              <FormGroup>
                <Label>Income Level Before Scheme</Label>
                <Select
                  value={formData.section1.incomeBefore}
                  onChange={(e) => handleInputChange('section1', 'incomeBefore', e.target.value)}
                >
                  <option value="">Select income level</option>
                  <option value="below_50k">Below ₹50,000</option>
                  <option value="50k_1l">₹50,000 - ₹1,00,000</option>
                  <option value="1l_2l">₹1,00,000 - ₹2,00,000</option>
                  <option value="2l_3l">₹2,00,000 - ₹3,00,000</option>
                  <option value="3l_5l">₹3,00,000 - ₹5,00,000</option>
                  <option value="above_5l">Above ₹5,00,000</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Have you received benefits from any scheme?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="receivedBenefit"
                      value="yes"
                      checked={formData.section1.receivedBenefit === 'yes'}
                      onChange={(e) => handleInputChange('section1', 'receivedBenefit', e.target.value)}
                    />
                    Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="receivedBenefit"
                      value="no"
                      checked={formData.section1.receivedBenefit === 'no'}
                      onChange={(e) => handleInputChange('section1', 'receivedBenefit', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              {formData.section1.receivedBenefit === 'yes' && (
                <>
                  <FormGroup>
                    <Label>Which schemes have you benefited from? (Select all that apply)</Label>
                    <CheckboxGroup>
                      {['inter_caste_marriage', 'widow_remarriage', 'others_scheme'].map((scheme) => (
                        <CheckboxItem key={scheme}>
                          <Checkbox
                            checked={formData.section1.schemes.includes(scheme)}
                            onChange={(e) => handleCheckboxChange('section1', 'schemes', scheme, e.target.checked)}
                          />
                          {scheme === 'inter_caste_marriage' && 'Inter-caste Marriage Scheme'}
                          {scheme === 'widow_remarriage' && 'Widow Remarriage Scheme'}
                          {scheme === 'others_scheme' && 'Other Schemes'}
                        </CheckboxItem>
                      ))}
                    </CheckboxGroup>
                  </FormGroup>

                  <FormGroup>
                    <Label>Date of Benefit Received</Label>
                    <Input
                      type="date"
                      value={formData.section1.dateOfBenefit}
                      onChange={(e) => handleInputChange('section1', 'dateOfBenefit', e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>How did you utilize the scheme benefits? (Select all that apply)</Label>
                    <CheckboxGroup>
                      {['housing', 'business', 'savings', 'daily_needs', 'education'].map((utilization) => (
                        <CheckboxItem key={utilization}>
                          <Checkbox
                            checked={formData.section1.utilization.includes(utilization)}
                            onChange={(e) => handleCheckboxChange('section1', 'utilization', utilization, e.target.checked)}
                          />
                          {utilization.charAt(0).toUpperCase() + utilization.slice(1).replace('_', ' ')}
                        </CheckboxItem>
                      ))}
                    </CheckboxGroup>
                  </FormGroup>
                </>
              )}

              <FormGroup>
                <Label>Caste Category</Label>
                <Select
                  value={formData.section1.casteCategory}
                  onChange={(e) => handleInputChange('section1', 'casteCategory', e.target.value)}
                >
                  <option value="">Select caste category</option>
                  <option value="sc">Scheduled Caste (SC)</option>
                  <option value="st">Scheduled Tribe (ST)</option>
                  <option value="obc">Other Backward Class (OBC)</option>
                  <option value="general">General</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Was your marriage opposed by family/community?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="marriageOpposed"
                      value="yes"
                      checked={formData.section1.marriageOpposed === 'yes'}
                      onChange={(e) => handleInputChange('section1', 'marriageOpposed', e.target.value)}
                    />
                    Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="marriageOpposed"
                      value="no"
                      checked={formData.section1.marriageOpposed === 'no'}
                      onChange={(e) => handleInputChange('section1', 'marriageOpposed', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Did you have to relocate after marriage?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="relocated"
                      value="yes"
                      checked={formData.section1.relocated === 'yes'}
                      onChange={(e) => handleInputChange('section1', 'relocated', e.target.value)}
                    />
                    Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="relocated"
                      value="no"
                      checked={formData.section1.relocated === 'no'}
                      onChange={(e) => handleInputChange('section1', 'relocated', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Did you provide Aadhaar details for the scheme?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="aadhaarProvided"
                      value="yes"
                      checked={formData.section1.aadhaarProvided === 'yes'}
                      onChange={(e) => handleInputChange('section1', 'aadhaarProvided', e.target.value)}
                    />
                    Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="aadhaarProvided"
                      value="no"
                      checked={formData.section1.aadhaarProvided === 'no'}
                      onChange={(e) => handleInputChange('section1', 'aadhaarProvided', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>
            </SectionContent>
          </>
        )}

        {/* Section 2: Socio-Economic Impact */}
        {currentSection === 2 && (
          <>
            <SectionHeader>
              <SectionTitle>Section 2: Socio-Economic Impact</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FormGroup>
                <Label>What is your current occupation?</Label>
                <Input
                  type="text"
                  value={formData.section2.occupationAfter}
                  onChange={(e) => handleInputChange('section2', 'occupationAfter', e.target.value)}
                  placeholder="Enter your current occupation"
                />
              </FormGroup>

              <FormGroup>
                <Label>Current Income Level</Label>
                <Select
                  value={formData.section2.incomeAfter}
                  onChange={(e) => handleInputChange('section2', 'incomeAfter', e.target.value)}
                >
                  <option value="">Select current income level</option>
                  <option value="below_50k">Below ₹50,000</option>
                  <option value="50k_1l">₹50,000 - ₹1,00,000</option>
                  <option value="1l_2l">₹1,00,000 - ₹2,00,000</option>
                  <option value="2l_3l">₹2,00,000 - ₹3,00,000</option>
                  <option value="3l_5l">₹3,00,000 - ₹5,00,000</option>
                  <option value="above_5l">Above ₹5,00,000</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>How would you describe your socio-economic status before the scheme?</Label>
                <Select
                  value={formData.section2.socioEconomicStatusBefore}
                  onChange={(e) => handleInputChange('section2', 'socioEconomicStatusBefore', e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="very_poor">Very Poor</option>
                  <option value="poor">Poor</option>
                  <option value="average">Average</option>
                  <option value="good">Good</option>
                  <option value="very_good">Very Good</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>On a scale of 1-5, how financially secure do you feel now? (1=Very Insecure, 5=Very Secure)</Label>
                <Select
                  value={formData.section2.financialSecurityScale}
                  onChange={(e) => handleInputChange('section2', 'financialSecurityScale', e.target.value)}
                >
                  <option value="">Select rating</option>
                  <option value="1">1 - Very Insecure</option>
                  <option value="2">2 - Insecure</option>
                  <option value="3">3 - Neutral</option>
                  <option value="4">4 - Secure</option>
                  <option value="5">5 - Very Secure</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Is your spouse currently employed?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="spouseEmploymentAfter"
                      value="yes"
                      checked={formData.section2.spouseEmploymentAfter === 'yes'}
                      onChange={(e) => handleInputChange('section2', 'spouseEmploymentAfter', e.target.value)}
                    />
                    Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="spouseEmploymentAfter"
                      value="no"
                      checked={formData.section2.spouseEmploymentAfter === 'no'}
                      onChange={(e) => handleInputChange('section2', 'spouseEmploymentAfter', e.target.value)}
                    />
                    No
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="spouseEmploymentAfter"
                      value="not_applicable"
                      checked={formData.section2.spouseEmploymentAfter === 'not_applicable'}
                      onChange={(e) => handleInputChange('section2', 'spouseEmploymentAfter', e.target.value)}
                    />
                    Not Applicable
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>How would you describe your current socio-economic status?</Label>
                <Select
                  value={formData.section2.socioEconomicStatusAfter}
                  onChange={(e) => handleInputChange('section2', 'socioEconomicStatusAfter', e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="very_poor">Very Poor</option>
                  <option value="poor">Poor</option>
                  <option value="average">Average</option>
                  <option value="good">Good</option>
                  <option value="very_good">Very Good</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>How has the scheme impacted your social life?</Label>
                <Select
                  value={formData.section2.socialLifeImpact}
                  onChange={(e) => handleInputChange('section2', 'socialLifeImpact', e.target.value)}
                >
                  <option value="">Select impact</option>
                  <option value="significantly_improved">Significantly Improved</option>
                  <option value="moderately_improved">Moderately Improved</option>
                  <option value="slightly_improved">Slightly Improved</option>
                  <option value="no_change">No Change</option>
                  <option value="worsened">Worsened</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Who makes decisions about how to use the scheme funds in your household?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="fundDecisionMaker"
                      value="self"
                      checked={formData.section2.fundDecisionMaker === 'self'}
                      onChange={(e) => handleInputChange('section2', 'fundDecisionMaker', e.target.value)}
                    />
                    Myself
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="fundDecisionMaker"
                      value="spouse"
                      checked={formData.section2.fundDecisionMaker === 'spouse'}
                      onChange={(e) => handleInputChange('section2', 'fundDecisionMaker', e.target.value)}
                    />
                    Spouse
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="fundDecisionMaker"
                      value="joint"
                      checked={formData.section2.fundDecisionMaker === 'joint'}
                      onChange={(e) => handleInputChange('section2', 'fundDecisionMaker', e.target.value)}
                    />
                    Joint Decision
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="fundDecisionMaker"
                      value="family_elders"
                      checked={formData.section2.fundDecisionMaker === 'family_elders'}
                      onChange={(e) => handleInputChange('section2', 'fundDecisionMaker', e.target.value)}
                    />
                    Family Elders
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Has the scheme reduced your financial dependency on others?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="financialDependencyReduced"
                      value="yes_significantly"
                      checked={formData.section2.financialDependencyReduced === 'yes_significantly'}
                      onChange={(e) => handleInputChange('section2', 'financialDependencyReduced', e.target.value)}
                    />
                    Yes, Significantly
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="financialDependencyReduced"
                      value="yes_somewhat"
                      checked={formData.section2.financialDependencyReduced === 'yes_somewhat'}
                      onChange={(e) => handleInputChange('section2', 'financialDependencyReduced', e.target.value)}
                    />
                    Yes, Somewhat
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="financialDependencyReduced"
                      value="no"
                      checked={formData.section2.financialDependencyReduced === 'no'}
                      onChange={(e) => handleInputChange('section2', 'financialDependencyReduced', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Have you started any new livelihood activities with the scheme benefits?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="startedNewLivelihood"
                      value="yes"
                      checked={formData.section2.startedNewLivelihood === 'yes'}
                      onChange={(e) => handleInputChange('section2', 'startedNewLivelihood', e.target.value)}
                    />
                    Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="startedNewLivelihood"
                      value="no"
                      checked={formData.section2.startedNewLivelihood === 'no'}
                      onChange={(e) => handleInputChange('section2', 'startedNewLivelihood', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>
            </SectionContent>
          </>
        )}

        {/* Section 3: Social Inclusion */}
        {currentSection === 3 && (
          <>
            <SectionHeader>
              <SectionTitle>Section 3: Social Inclusion</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FormGroup>
                <Label>On a scale of 1-5, how much progressive change have you experienced? (1=No Change, 5=Significant Change)</Label>
                <Select
                  value={formData.section3.progressiveChangeScale}
                  onChange={(e) => handleInputChange('section3', 'progressiveChangeScale', e.target.value)}
                >
                  <option value="">Select rating</option>
                  <option value="1">1 - No Change</option>
                  <option value="2">2 - Little Change</option>
                  <option value="3">3 - Moderate Change</option>
                  <option value="4">4 - Good Change</option>
                  <option value="5">5 - Significant Change</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Do you feel more socially accepted in your community now?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="feltSociallyAccepted"
                      value="yes_much_more"
                      checked={formData.section3.feltSociallyAccepted === 'yes_much_more'}
                      onChange={(e) => handleInputChange('section3', 'feltSociallyAccepted', e.target.value)}
                    />
                    Yes, Much More
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="feltSociallyAccepted"
                      value="yes_somewhat"
                      checked={formData.section3.feltSociallyAccepted === 'yes_somewhat'}
                      onChange={(e) => handleInputChange('section3', 'feltSociallyAccepted', e.target.value)}
                    />
                    Yes, Somewhat
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="feltSociallyAccepted"
                      value="no_change"
                      checked={formData.section3.feltSociallyAccepted === 'no_change'}
                      onChange={(e) => handleInputChange('section3', 'feltSociallyAccepted', e.target.value)}
                    />
                    No Change
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="feltSociallyAccepted"
                      value="less_accepted"
                      checked={formData.section3.feltSociallyAccepted === 'less_accepted'}
                      onChange={(e) => handleInputChange('section3', 'feltSociallyAccepted', e.target.value)}
                    />
                    Less Accepted
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Has caste-based discrimination reduced in your experience?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="discriminationReduction"
                      value="yes_significantly"
                      checked={formData.section3.discriminationReduction === 'yes_significantly'}
                      onChange={(e) => handleInputChange('section3', 'discriminationReduction', e.target.value)}
                    />
                    Yes, Significantly
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="discriminationReduction"
                      value="yes_somewhat"
                      checked={formData.section3.discriminationReduction === 'yes_somewhat'}
                      onChange={(e) => handleInputChange('section3', 'discriminationReduction', e.target.value)}
                    />
                    Yes, Somewhat
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="discriminationReduction"
                      value="no_change"
                      checked={formData.section3.discriminationReduction === 'no_change'}
                      onChange={(e) => handleInputChange('section3', 'discriminationReduction', e.target.value)}
                    />
                    No Change
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="discriminationReduction"
                      value="increased"
                      checked={formData.section3.discriminationReduction === 'increased'}
                      onChange={(e) => handleInputChange('section3', 'discriminationReduction', e.target.value)}
                    />
                    Increased
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Do you feel more secure in your community now?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="feltMoreSecure"
                      value="yes"
                      checked={formData.section3.feltMoreSecure === 'yes'}
                      onChange={(e) => handleInputChange('section3', 'feltMoreSecure', e.target.value)}
                    />
                    Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="feltMoreSecure"
                      value="no"
                      checked={formData.section3.feltMoreSecure === 'no'}
                      onChange={(e) => handleInputChange('section3', 'feltMoreSecure', e.target.value)}
                    />
                    No
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="feltMoreSecure"
                      value="same_as_before"
                      checked={formData.section3.feltMoreSecure === 'same_as_before'}
                      onChange={(e) => handleInputChange('section3', 'feltMoreSecure', e.target.value)}
                    />
                    Same as Before
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Are you currently living with your in-laws?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="livingWithInLaws"
                      value="yes"
                      checked={formData.section3.livingWithInLaws === 'yes'}
                      onChange={(e) => handleInputChange('section3', 'livingWithInLaws', e.target.value)}
                    />
                    Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="livingWithInLaws"
                      value="no"
                      checked={formData.section3.livingWithInLaws === 'no'}
                      onChange={(e) => handleInputChange('section3', 'livingWithInLaws', e.target.value)}
                    />
                    No
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="livingWithInLaws"
                      value="sometimes"
                      checked={formData.section3.livingWithInLaws === 'sometimes'}
                      onChange={(e) => handleInputChange('section3', 'livingWithInLaws', e.target.value)}
                    />
                    Sometimes
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Have you faced discrimination from in-laws?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="inLawDiscrimination"
                      value="yes"
                      checked={formData.section3.inLawDiscrimination === 'yes'}
                      onChange={(e) => handleInputChange('section3', 'inLawDiscrimination', e.target.value)}
                    />
                    Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="inLawDiscrimination"
                      value="no"
                      checked={formData.section3.inLawDiscrimination === 'no'}
                      onChange={(e) => handleInputChange('section3', 'inLawDiscrimination', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              {formData.section3.inLawDiscrimination === 'yes' && (
                <FormGroup>
                  <Label>Please describe the discrimination you faced:</Label>
                  <TextArea
                    value={formData.section3.inLawDiscriminationDetails}
                    onChange={(e) => handleInputChange('section3', 'inLawDiscriminationDetails', e.target.value)}
                    placeholder="Describe the discrimination you experienced"
                  />
                </FormGroup>
              )}

              <FormGroup>
                <Label>Have you filed any police complaint regarding discrimination?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="filedPoliceComplaint"
                      value="yes"
                      checked={formData.section3.filedPoliceComplaint === 'yes'}
                      onChange={(e) => handleInputChange('section3', 'filedPoliceComplaint', e.target.value)}
                    />
                    Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="filedPoliceComplaint"
                      value="no"
                      checked={formData.section3.filedPoliceComplaint === 'no'}
                      onChange={(e) => handleInputChange('section3', 'filedPoliceComplaint', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Have you received support from NGOs or government officials?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="supportFromNgosOrOfficials"
                      value="yes_ngos"
                      checked={formData.section3.supportFromNgosOrOfficials === 'yes_ngos'}
                      onChange={(e) => handleInputChange('section3', 'supportFromNgosOrOfficials', e.target.value)}
                    />
                    Yes, from NGOs
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="supportFromNgosOrOfficials"
                      value="yes_officials"
                      checked={formData.section3.supportFromNgosOrOfficials === 'yes_officials'}
                      onChange={(e) => handleInputChange('section3', 'supportFromNgosOrOfficials', e.target.value)}
                    />
                    Yes, from Government Officials
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="supportFromNgosOrOfficials"
                      value="yes_both"
                      checked={formData.section3.supportFromNgosOrOfficials === 'yes_both'}
                      onChange={(e) => handleInputChange('section3', 'supportFromNgosOrOfficials', e.target.value)}
                    />
                    Yes, from Both
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="supportFromNgosOrOfficials"
                      value="no"
                      checked={formData.section3.supportFromNgosOrOfficials === 'no'}
                      onChange={(e) => handleInputChange('section3', 'supportFromNgosOrOfficials', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>
            </SectionContent>
          </>
        )}

        {/* Section 4: Service Quality */}
        {currentSection === 4 && (
          <>
            <SectionHeader>
              <SectionTitle>Section 4: Service Quality & Implementation</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FormGroup>
                <Label>How did you become aware of the scheme?</Label>
                <Select
                  value={formData.section4.schemeAwarenessSource}
                  onChange={(e) => handleInputChange('section4', 'schemeAwarenessSource', e.target.value)}
                >
                  <option value="">Select source</option>
                  <option value="government_officials">Government Officials</option>
                  <option value="ngo">NGO</option>
                  <option value="friends_family">Friends/Family</option>
                  <option value="media">Media</option>
                  <option value="community_leaders">Community Leaders</option>
                  <option value="others">Others</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Were the officials supportive during the application process?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="officialsSupportive"
                      value="very_supportive"
                      checked={formData.section4.officialsSupportive === 'very_supportive'}
                      onChange={(e) => handleInputChange('section4', 'officialsSupportive', e.target.value)}
                    />
                    Very Supportive
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="officialsSupportive"
                      value="somewhat_supportive"
                      checked={formData.section4.officialsSupportive === 'somewhat_supportive'}
                      onChange={(e) => handleInputChange('section4', 'officialsSupportive', e.target.value)}
                    />
                    Somewhat Supportive
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="officialsSupportive"
                      value="neutral"
                      checked={formData.section4.officialsSupportive === 'neutral'}
                      onChange={(e) => handleInputChange('section4', 'officialsSupportive', e.target.value)}
                    />
                    Neutral
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="officialsSupportive"
                      value="unsupportive"
                      checked={formData.section4.officialsSupportive === 'unsupportive'}
                      onChange={(e) => handleInputChange('section4', 'officialsSupportive', e.target.value)}
                    />
                    Unsupportive
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>How difficult was the application process?</Label>
                <Select
                  value={formData.section4.applicationDifficulty}
                  onChange={(e) => handleInputChange('section4', 'applicationDifficulty', e.target.value)}
                >
                  <option value="">Select difficulty level</option>
                  <option value="very_easy">Very Easy</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="difficult">Difficult</option>
                  <option value="very_difficult">Very Difficult</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>How long did it take to receive the benefit after applying?</Label>
                <Select
                  value={formData.section4.timeToReceiveBenefit}
                  onChange={(e) => handleInputChange('section4', 'timeToReceiveBenefit', e.target.value)}
                >
                  <option value="">Select time period</option>
                  <option value="within_1_month">Within 1 Month</option>
                  <option value="1_3_months">1-3 Months</option>
                  <option value="3_6_months">3-6 Months</option>
                  <option value="6_12_months">6-12 Months</option>
                  <option value="more_than_1_year">More than 1 Year</option>
                  <option value="still_waiting">Still Waiting</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>How effective was the disbursement process?</Label>
                <Select
                  value={formData.section4.disbursementEffectiveness}
                  onChange={(e) => handleInputChange('section4', 'disbursementEffectiveness', e.target.value)}
                >
                  <option value="">Select effectiveness</option>
                  <option value="very_effective">Very Effective</option>
                  <option value="effective">Effective</option>
                  <option value="moderately_effective">Moderately Effective</option>
                  <option value="ineffective">Ineffective</option>
                  <option value="very_ineffective">Very Ineffective</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Were you fully aware of all scheme details before applying?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="awareOfSchemeDetails"
                      value="fully_aware"
                      checked={formData.section4.awareOfSchemeDetails === 'fully_aware'}
                      onChange={(e) => handleInputChange('section4', 'awareOfSchemeDetails', e.target.value)}
                    />
                    Fully Aware
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="awareOfSchemeDetails"
                      value="partially_aware"
                      checked={formData.section4.awareOfSchemeDetails === 'partially_aware'}
                      onChange={(e) => handleInputChange('section4', 'awareOfSchemeDetails', e.target.value)}
                    />
                    Partially Aware
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="awareOfSchemeDetails"
                      value="not_aware"
                      checked={formData.section4.awareOfSchemeDetails === 'not_aware'}
                      onChange={(e) => handleInputChange('section4', 'awareOfSchemeDetails', e.target.value)}
                    />
                    Not Aware
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>What is the current status of your application?</Label>
                <Select
                  value={formData.section4.applicationStatus}
                  onChange={(e) => handleInputChange('section4', 'applicationStatus', e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="approved_received">Approved and Received</option>
                  <option value="approved_pending">Approved but Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="rejected">Rejected</option>
                  <option value="resubmitted">Resubmitted</option>
                </Select>
              </FormGroup>

              {formData.section4.applicationStatus === 'approved_pending' && (
                <FormGroup>
                  <Label>How long has it been pending?</Label>
                  <Input
                    type="text"
                    value={formData.section4.pendingDuration}
                    onChange={(e) => handleInputChange('section4', 'pendingDuration', e.target.value)}
                    placeholder="e.g., 6 months"
                  />
                </FormGroup>
              )}

              {formData.section4.applicationStatus === 'rejected' && (
                <>
                  <FormGroup>
                    <Label>Was the reason for rejection clearly communicated to you?</Label>
                    <RadioGroup>
                      <RadioItem>
                        <Radio
                          name="rejectionReasonCommunicated"
                          value="yes"
                          checked={formData.section4.rejectionReasonCommunicated === 'yes'}
                          onChange={(e) => handleInputChange('section4', 'rejectionReasonCommunicated', e.target.value)}
                        />
                        Yes
                      </RadioItem>
                      <RadioItem>
                        <Radio
                          name="rejectionReasonCommunicated"
                          value="no"
                          checked={formData.section4.rejectionReasonCommunicated === 'no'}
                          onChange={(e) => handleInputChange('section4', 'rejectionReasonCommunicated', e.target.value)}
                        />
                        No
                      </RadioItem>
                    </RadioGroup>
                  </FormGroup>

                  <FormGroup>
                    <Label>What was the reason for rejection?</Label>
                    <TextArea
                      value={formData.section4.rejectionReason}
                      onChange={(e) => handleInputChange('section4', 'rejectionReason', e.target.value)}
                      placeholder="Please describe the reason for rejection"
                    />
                  </FormGroup>
                </>
              )}

              <FormGroup>
                <Label>How would you rate the quality of information provided about the scheme?</Label>
                <Select
                  value={formData.section4.qualityOfInformation}
                  onChange={(e) => handleInputChange('section4', 'qualityOfInformation', e.target.value)}
                >
                  <option value="">Select rating</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="poor">Poor</option>
                  <option value="very_poor">Very Poor</option>
                </Select>
              </FormGroup>
            </SectionContent>
          </>
        )}

        {/* Section 5: Satisfaction & Recommendations */}
        {currentSection === 5 && (
          <>
            <SectionHeader>
              <SectionTitle>Section 5: Satisfaction & Recommendations</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <FormGroup>
                <Label>Do you think the scheme is successful in reducing caste-based discrimination?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessCasteDiscrimination"
                      value="very_successful"
                      checked={formData.section5.schemeSuccessCasteDiscrimination === 'very_successful'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessCasteDiscrimination', e.target.value)}
                    />
                    Very Successful
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessCasteDiscrimination"
                      value="somewhat_successful"
                      checked={formData.section5.schemeSuccessCasteDiscrimination === 'somewhat_successful'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessCasteDiscrimination', e.target.value)}
                    />
                    Somewhat Successful
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessCasteDiscrimination"
                      value="not_successful"
                      checked={formData.section5.schemeSuccessCasteDiscrimination === 'not_successful'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessCasteDiscrimination', e.target.value)}
                    />
                    Not Successful
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessCasteDiscrimination"
                      value="uncertain"
                      checked={formData.section5.schemeSuccessCasteDiscrimination === 'uncertain'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessCasteDiscrimination', e.target.value)}
                    />
                    Uncertain
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Has the scheme improved your sense of security and dignity?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessSecurity"
                      value="significantly_improved"
                      checked={formData.section5.schemeSuccessSecurity === 'significantly_improved'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessSecurity', e.target.value)}
                    />
                    Significantly Improved
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessSecurity"
                      value="moderately_improved"
                      checked={formData.section5.schemeSuccessSecurity === 'moderately_improved'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessSecurity', e.target.value)}
                    />
                    Moderately Improved
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessSecurity"
                      value="slightly_improved"
                      checked={formData.section5.schemeSuccessSecurity === 'slightly_improved'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessSecurity', e.target.value)}
                    />
                    Slightly Improved
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessSecurity"
                      value="no_change"
                      checked={formData.section5.schemeSuccessSecurity === 'no_change'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessSecurity', e.target.value)}
                    />
                    No Change
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>What areas of the scheme need improvement? (Select all that apply)</Label>
                <CheckboxGroup>
                  {[
                    'application_process',
                    'disbursement_speed',
                    'information_quality',
                    'official_support',
                    'scheme_amount',
                    'follow_up_support',
                    'awareness_campaigns',
                    'documentation_requirements'
                  ].map((area) => (
                    <CheckboxItem key={area}>
                      <Checkbox
                        checked={formData.section5.areasForImprovement.includes(area)}
                        onChange={(e) => handleCheckboxChange('section5', 'areasForImprovement', area, e.target.checked)}
                      />
                      {area.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </CheckboxItem>
                  ))}
                </CheckboxGroup>
              </FormGroup>

              <FormGroup>
                <Label>Should the incentive amount be revised?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="shouldReviseIncentive"
                      value="increase_significantly"
                      checked={formData.section5.shouldReviseIncentive === 'increase_significantly'}
                      onChange={(e) => handleInputChange('section5', 'shouldReviseIncentive', e.target.value)}
                    />
                    Should be Increased Significantly
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="shouldReviseIncentive"
                      value="increase_moderately"
                      checked={formData.section5.shouldReviseIncentive === 'increase_moderately'}
                      onChange={(e) => handleInputChange('section5', 'shouldReviseIncentive', e.target.value)}
                    />
                    Should be Increased Moderately
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="shouldReviseIncentive"
                      value="current_amount_adequate"
                      checked={formData.section5.shouldReviseIncentive === 'current_amount_adequate'}
                      onChange={(e) => handleInputChange('section5', 'shouldReviseIncentive', e.target.value)}
                    />
                    Current Amount is Adequate
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="shouldReviseIncentive"
                      value="can_be_reduced"
                      checked={formData.section5.shouldReviseIncentive === 'can_be_reduced'}
                      onChange={(e) => handleInputChange('section5', 'shouldReviseIncentive', e.target.value)}
                    />
                    Can be Reduced
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>What benefits have you experienced from the scheme? (Select all that apply)</Label>
                <CheckboxGroup>
                  {[
                    'financial_security',
                    'social_acceptance',
                    'reduced_discrimination',
                    'improved_confidence',
                    'better_livelihood',
                    'family_support',
                    'community_respect',
                    'educational_opportunities'
                  ].map((benefit) => (
                    <CheckboxItem key={benefit}>
                      <Checkbox
                        checked={formData.section5.experiencedBenefits.includes(benefit)}
                        onChange={(e) => handleCheckboxChange('section5', 'experiencedBenefits', benefit, e.target.checked)}
                      />
                      {benefit.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </CheckboxItem>
                  ))}
                </CheckboxGroup>
              </FormGroup>

              <FormGroup>
                <Label>Should this scheme be continued in the future?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="shouldContinueScheme"
                      value="definitely_yes"
                      checked={formData.section5.shouldContinueScheme === 'definitely_yes'}
                      onChange={(e) => handleInputChange('section5', 'shouldContinueScheme', e.target.value)}
                    />
                    Definitely Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="shouldContinueScheme"
                      value="yes_with_improvements"
                      checked={formData.section5.shouldContinueScheme === 'yes_with_improvements'}
                      onChange={(e) => handleInputChange('section5', 'shouldContinueScheme', e.target.value)}
                    />
                    Yes, with Improvements
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="shouldContinueScheme"
                      value="uncertain"
                      checked={formData.section5.shouldContinueScheme === 'uncertain'}
                      onChange={(e) => handleInputChange('section5', 'shouldContinueScheme', e.target.value)}
                    />
                    Uncertain
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="shouldContinueScheme"
                      value="no"
                      checked={formData.section5.shouldContinueScheme === 'no'}
                      onChange={(e) => handleInputChange('section5', 'shouldContinueScheme', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Would you encourage others to pursue inter-caste marriage?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="encourageIntercasteMarriage"
                      value="definitely_yes"
                      checked={formData.section5.encourageIntercasteMarriage === 'definitely_yes'}
                      onChange={(e) => handleInputChange('section5', 'encourageIntercasteMarriage', e.target.value)}
                    />
                    Definitely Yes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="encourageIntercasteMarriage"
                      value="yes_with_caution"
                      checked={formData.section5.encourageIntercasteMarriage === 'yes_with_caution'}
                      onChange={(e) => handleInputChange('section5', 'encourageIntercasteMarriage', e.target.value)}
                    />
                    Yes, with Caution
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="encourageIntercasteMarriage"
                      value="neutral"
                      checked={formData.section5.encourageIntercasteMarriage === 'neutral'}
                      onChange={(e) => handleInputChange('section5', 'encourageIntercasteMarriage', e.target.value)}
                    />
                    Neutral
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="encourageIntercasteMarriage"
                      value="no"
                      checked={formData.section5.encourageIntercasteMarriage === 'no'}
                      onChange={(e) => handleInputChange('section5', 'encourageIntercasteMarriage', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Has the scheme helped reduce discrimination in your area overall?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="schemeHelpedReduceDiscriminationInArea"
                      value="yes_significantly"
                      checked={formData.section5.schemeHelpedReduceDiscriminationInArea === 'yes_significantly'}
                      onChange={(e) => handleInputChange('section5', 'schemeHelpedReduceDiscriminationInArea', e.target.value)}
                    />
                    Yes, Significantly
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeHelpedReduceDiscriminationInArea"
                      value="yes_somewhat"
                      checked={formData.section5.schemeHelpedReduceDiscriminationInArea === 'yes_somewhat'}
                      onChange={(e) => handleInputChange('section5', 'schemeHelpedReduceDiscriminationInArea', e.target.value)}
                    />
                    Yes, Somewhat
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeHelpedReduceDiscriminationInArea"
                      value="no_change"
                      checked={formData.section5.schemeHelpedReduceDiscriminationInArea === 'no_change'}
                      onChange={(e) => handleInputChange('section5', 'schemeHelpedReduceDiscriminationInArea', e.target.value)}
                    />
                    No Change
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeHelpedReduceDiscriminationInArea"
                      value="uncertain"
                      checked={formData.section5.schemeHelpedReduceDiscriminationInArea === 'uncertain'}
                      onChange={(e) => handleInputChange('section5', 'schemeHelpedReduceDiscriminationInArea', e.target.value)}
                    />
                    Uncertain
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>What kind of future support do you expect? (Select all that apply)</Label>
                <CheckboxGroup>
                  {[
                    'continued_financial_support',
                    'employment_opportunities',
                    'educational_support',
                    'healthcare_benefits',
                    'housing_assistance',
                    'skill_development',
                    'legal_support',
                    'counseling_services'
                  ].map((support) => (
                    <CheckboxItem key={support}>
                      <Checkbox
                        checked={formData.section5.futureSupportExpected.includes(support)}
                        onChange={(e) => handleCheckboxChange('section5', 'futureSupportExpected', support, e.target.checked)}
                      />
                      {support.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </CheckboxItem>
                  ))}
                </CheckboxGroup>
              </FormGroup>
            </SectionContent>
          </>
        )}

        {/* Section 6: Special Category - Devadasi Children */}
        {currentSection === 6 && (
          <>
            <SectionHeader>
              <SectionTitle>Section 6: Special Category - Children of Devadasi Women</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f4f8', borderRadius: '8px', borderLeft: '4px solid #4299e1' }}>
                <strong>Note:</strong> This section is specifically for children of Devadasi women who have benefited from marriage incentive schemes. If this doesn't apply to you, you can skip this section.
              </div>

              <FormGroup>
                <Label>At what age did you get married?</Label>
                <Input
                  type="number"
                  value={formData.section6_DevadasiChildren.childAgeAtMarriage}
                  onChange={(e) => handleInputChange('section6_DevadasiChildren', 'childAgeAtMarriage', e.target.value)}
                  placeholder="Enter your age at marriage"
                />
              </FormGroup>

              <FormGroup>
                <Label>Has the scheme improved your dignity and social standing?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="schemeImprovedDignity"
                      value="significantly_improved"
                      checked={formData.section6_DevadasiChildren.schemeImprovedDignity === 'significantly_improved'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'schemeImprovedDignity', e.target.value)}
                    />
                    Significantly Improved
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeImprovedDignity"
                      value="moderately_improved"
                      checked={formData.section6_DevadasiChildren.schemeImprovedDignity === 'moderately_improved'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'schemeImprovedDignity', e.target.value)}
                    />
                    Moderately Improved
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeImprovedDignity"
                      value="slightly_improved"
                      checked={formData.section6_DevadasiChildren.schemeImprovedDignity === 'slightly_improved'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'schemeImprovedDignity', e.target.value)}
                    />
                    Slightly Improved
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeImprovedDignity"
                      value="no_change"
                      checked={formData.section6_DevadasiChildren.schemeImprovedDignity === 'no_change'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'schemeImprovedDignity', e.target.value)}
                    />
                    No Change
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>Do you feel you are treated differently because of your mother's background?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="treatmentDifference"
                      value="yes_negatively"
                      checked={formData.section6_DevadasiChildren.treatmentDifference === 'yes_negatively'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'treatmentDifference', e.target.value)}
                    />
                    Yes, Negatively
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="treatmentDifference"
                      value="sometimes"
                      checked={formData.section6_DevadasiChildren.treatmentDifference === 'sometimes'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'treatmentDifference', e.target.value)}
                    />
                    Sometimes
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="treatmentDifference"
                      value="no"
                      checked={formData.section6_DevadasiChildren.treatmentDifference === 'no'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'treatmentDifference', e.target.value)}
                    />
                    No
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="treatmentDifference"
                      value="not_sure"
                      checked={formData.section6_DevadasiChildren.treatmentDifference === 'not_sure'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'treatmentDifference', e.target.value)}
                    />
                    Not Sure
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>What is your spouse's caste background?</Label>
                <Select
                  value={formData.section6_DevadasiChildren.spouseCaste}
                  onChange={(e) => handleInputChange('section6_DevadasiChildren', 'spouseCaste', e.target.value)}
                >
                  <option value="">Select caste category</option>
                  <option value="same_caste">Same Caste</option>
                  <option value="different_sc">Different SC</option>
                  <option value="st">ST</option>
                  <option value="obc">OBC</option>
                  <option value="general">General</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Do you own any property now (land, house, etc.)?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="ownsPropertyNow"
                      value="yes_independently"
                      checked={formData.section6_DevadasiChildren.ownsPropertyNow === 'yes_independently'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'ownsPropertyNow', e.target.value)}
                    />
                    Yes, Independently
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="ownsPropertyNow"
                      value="yes_jointly"
                      checked={formData.section6_DevadasiChildren.ownsPropertyNow === 'yes_jointly'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'ownsPropertyNow', e.target.value)}
                    />
                    Yes, Jointly
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="ownsPropertyNow"
                      value="no"
                      checked={formData.section6_DevadasiChildren.ownsPropertyNow === 'no'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'ownsPropertyNow', e.target.value)}
                    />
                    No
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>On a scale of 1-5, how accepted are you by your in-laws? (1=Not at all, 5=Completely accepted)</Label>
                <Select
                  value={formData.section6_DevadasiChildren.inLawAcceptabilityScale}
                  onChange={(e) => handleInputChange('section6_DevadasiChildren', 'inLawAcceptabilityScale', e.target.value)}
                >
                  <option value="">Select rating</option>
                  <option value="1">1 - Not at all accepted</option>
                  <option value="2">2 - Poorly accepted</option>
                  <option value="3">3 - Moderately accepted</option>
                  <option value="4">4 - Well accepted</option>
                  <option value="5">5 - Completely accepted</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Have you faced any stigma related to your background since marriage?</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="facedStigma"
                      value="frequently"
                      checked={formData.section6_DevadasiChildren.facedStigma === 'frequently'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'facedStigma', e.target.value)}
                    />
                    Frequently
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="facedStigma"
                      value="occasionally"
                      checked={formData.section6_DevadasiChildren.facedStigma === 'occasionally'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'facedStigma', e.target.value)}
                    />
                    Occasionally
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="facedStigma"
                      value="rarely"
                      checked={formData.section6_DevadasiChildren.facedStigma === 'rarely'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'facedStigma', e.target.value)}
                    />
                    Rarely
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="facedStigma"
                      value="never"
                      checked={formData.section6_DevadasiChildren.facedStigma === 'never'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'facedStigma', e.target.value)}
                    />
                    Never
                  </RadioItem>
                </RadioGroup>
              </FormGroup>
            </SectionContent>
          </>
        )}

        {/* Add the navigation buttons */}
        <ButtonGroup>
          <NavigationButtons>
            <Button onClick={prevSection} disabled={currentSection === 1}>
              Previous
            </Button>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="secondary" onClick={saveDraft} disabled={loading}>
                {loading ? 'Saving...' : 'Save Draft'}
              </Button>
              
              {currentSection === 6 ? (
                <Button variant="success" onClick={submitForm} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Response'}
                </Button>
              ) : (
                <Button variant="primary" onClick={nextSection}>
                  Next
                </Button>
              )}
            </div>
          </NavigationButtons>
        </ButtonGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </FormContainer>
    </PageContainer>
  );
}
