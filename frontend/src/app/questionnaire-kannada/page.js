"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../contexts/TranslationContext';
import EnhancedNavbar from '../../components/EnhancedNavbar';
import axios from 'axios';
import { FaUser, FaChartLine, FaUsers, FaClipboardCheck, FaCommentDots, FaChild, FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import ServerLink from '../../lib/api/serverURL';

// Styled components exactly matching the English version
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  font-family: 'Inter', sans-serif;
  padding-top: 80px; /* Add space for the fixed navbar */
  
  .dark & {
    background-color: #0f172a;
  }
`;

const PageContainer = styled.div`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.2;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  color: #4a5568;
  font-size: 1.2rem;
  margin-bottom: 20px;
  line-height: 1.6;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const TimeEstimate = styled.div`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #e6f3ff 0%, #cce7ff 100%);
  color: #1e40af;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 25px;
  border: 1px solid #bfdbfe;

  &::before {
    content: '⏱️';
    margin-right: 8px;
    font-size: 1rem;
  }
`;

const ProgressContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ProgressTitle = styled.h3`
  color: #1a202c;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ProgressText = styled.span`
  color: #4a5568;
  font-size: 0.9rem;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const SectionIndicators = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

const SectionIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 120px;
  padding: 15px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props =>
    props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
    props.completed ? '#e6fffa' : '#f7fafc'
  };
  border: 2px solid ${props =>
    props.active ? '#667eea' :
    props.completed ? '#38a169' : '#e2e8f0'
  };

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const SectionIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: ${props =>
    props.active ? 'white' :
    props.completed ? '#38a169' : '#a0aec0'
  };
`;

const SectionLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.3;
  color: ${props =>
    props.active ? 'white' : '#2d3748'
  };
`;

const FormContainer = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #667eea;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SectionDescription = styled.p`
  color: #4a5568;
  font-size: 1rem;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const QuestionNumber = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
  margin-right: 15px;
  font-size: 0.9rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 1rem;
  line-height: 1.5;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #ffffff;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;
  background-color: #ffffff;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const SubSectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin: 32px 0 20px 0;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
  background-color: #ffffff;

  &:hover {
    border-color: #cbd5e0;
    background-color: #f7fafc;
  }

  &:has(input:checked) {
    border-color: #667eea;
    background-color: #edf2f7;
  }
`;

const RadioInput = styled.input`
  margin-right: 12px;
  transform: scale(1.2);
  accent-color: #667eea;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
  background-color: #ffffff;

  &:hover {
    border-color: #cbd5e0;
    background-color: #f7fafc;
  }

  &:has(input:checked) {
    border-color: #667eea;
    background-color: #edf2f7;
  }
`;

const CheckboxInput = styled.input`
  margin-right: 12px;
  transform: scale(1.2);
  accent-color: #667eea;
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-top: 30px;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  ` : `
    background: #f7fafc;
    color: #4a5568;
    border: 2px solid #e2e8f0;
    
    &:hover {
      background: #edf2f7;
      border-color: #cbd5e0;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SECTIONS = [
  { title: 'ಪ್ರತಿಕ್ರಿಯಿಸುವವರ ಮಾಹಿತಿ ಮತ್ತು ಯೋಜನೆಯ ವಿವರಗಳು', description: 'ಜನಸಂಖ್ಯಾಶಾಸ್ತ್ರ ಮತ್ತು ಹಿನ್ನೆಲೆ', icon: FaUser },
  { title: 'ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಮತ್ತು ಜೀವನೋಪಾಯದ ಪರಿಣಾಮ', description: 'ಯೋಜನೆಯ ನಂತರದ ಬದಲಾವಣೆಗಳು', icon: FaChartLine },
  { title: 'ಸಾಮಾಜಿಕ ಒಳಗೊಳ್ಳುವಿಕೆ ಮತ್ತು ಭದ್ರತೆ', description: 'ಸಾಮಾಜಿಕ ಸ್ವೀಕಾರ ಮತ್ತು ಸವಾಲುಗಳು', icon: FaUsers },
  { title: 'ಜಾಗೃತಿ, ಪ್ರಕ್ರಿಯೆ ಮತ್ತು ಸೇವೆಯ ಗುಣಮಟ್ಟ', description: 'ಪ್ರಕ್ರಿಯೆಯೊಂದಿಗಿನ ಅನುಭವ', icon: FaClipboardCheck },
  { title: 'ಒಟ್ಟಾರೆ ತೃಪ್ತಿ, ಸವಾಲುಗಳು ಮತ್ತು ಶಿಫಾರಸ್ಸುಗಳು', description: 'ಸಲಹೆಗಳು ಮತ್ತು ಸುಧಾರಣೆಗಳು', icon: FaCommentDots },
  { title: 'ವಿಶೇಷ ವಿಭಾಗಗಳು', description: 'ದೇವದಾಸಿ ಮಕ್ಕಳು ಮತ್ತು ವಿಧವೆಯರ ಮರುವಿವಾಹ', icon: FaChild },
];

export default function KannadaQuestionnairePage() {
  const { isLoggedIn, user } = useAuth();
  const { language } = useTranslation();
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [completedSections, setCompletedSections] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Auto-save functionality
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');

  // Redirect to English questionnaire if language is English
  useEffect(() => {
    if (language === 'en') {
      router.push('/questionnaire-complete');
      return;
    }
  }, [language, router]);

  // Database submission functions
  const handleSubmit = async () => {
    if (!user?.id) {
      setError('ಸಲ್ಲಿಸಲು ನೀವು ಲಾಗ್ ಇನ್ ಆಗಿರಬೇಕು');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const responseData = {
        ...formData,
        userId: user.id,
        responseId: `KN_${user.id}_${Date.now()}`,
        language: 'kn',
        submissionDate: new Date().toISOString(),
        isComplete: true
      };

      const response = await axios.post(`${ServerLink}/api/responses`, responseData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setSuccess('ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!');
        setTimeout(() => {
          router.push('/questionnaire-complete');
        }, 2000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError('ಸಲ್ಲಿಸುವಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    if (!user?.id || Object.keys(formData).length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const draftData = {
        ...formData,
        userId: user.id,
        responseId: `DRAFT_KN_${user.id}`,
        language: 'kn',
        lastModified: new Date().toISOString(),
        isComplete: false,
        currentSection
      };

      await axios.post(`${ServerLink}/api/responses/draft`, draftData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setLastSavedTime(new Date());
      setAutoSaveStatus('ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಉಳಿಸಲಾಗಿದೆ');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  };

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(handleAutoSave, 2000);
    return () => clearTimeout(timer);
  }, [formData, user?.id]);

  const handleNext = () => {
    if (currentSection < SECTIONS.length) {
      if (!completedSections.includes(currentSection)) {
        setCompletedSections([...completedSections, currentSection]);
      }
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSectionChange = (sectionNumber) => {
    setCurrentSection(sectionNumber);
  };

  // Render Section 1 - ಪ್ರತಿಕ್ರಿಯಿಸುವವರ ಮಾಹಿತಿ ಮತ್ತು ಯೋಜನೆಯ ವಿವರಗಳು
  const renderSection1 = () => (
    <div>
      {/* Question 1 */}
      <FormGroup>
        <QuestionNumber>1</QuestionNumber>
        <Label>2020-21 / 2023-24 / 2024-25 ರಲ್ಲಿ ನಡೆದ ವಿವಾಹಗಳಿಗೆ ಸಮಾಜ ಕಲ್ಯಾಣ/ಪರಿಶಿಷ್ಟ ವರ್ಗಗಳ ಕಲ್ಯಾಣ ಇಲಾಖೆಗಳಿಂದ ಪ್ರೋತ್ಸಾಹಧನ ಪಡೆದಿದ್ದೀರಾ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="receivedIncentive"
              value="yes"
              checked={formData.receivedIncentive === 'yes'}
              onChange={(e) => setFormData({...formData, receivedIncentive: e.target.value})}
            />
            ಹೌದು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="receivedIncentive"
              value="no"
              checked={formData.receivedIncentive === 'no'}
              onChange={(e) => setFormData({...formData, receivedIncentive: e.target.value})}
            />
            ಇಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 2 - Facility Type */}
      {formData.receivedIncentive === 'yes' && (
        <FormGroup>
          <QuestionNumber>2</QuestionNumber>
          <Label>ಹೌದು ಎಂದಾದರೆ, ದಯವಿಟ್ಟು ಸಂಬಂಧಿಸಿದ ಸೌಲಭ್ಯವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ?</Label>
          <CheckboxGroup>
            <CheckboxOption>
              <CheckboxInput
                type="checkbox"
                name="facilityType"
                value="inter_caste_marriage"
                checked={formData.facilityType?.includes('inter_caste_marriage')}
                onChange={(e) => {
                  const value = e.target.value;
                  const current = formData.facilityType || [];
                  if (e.target.checked) {
                    setFormData({...formData, facilityType: [...current, value]});
                  } else {
                    setFormData({...formData, facilityType: current.filter(item => item !== value)});
                  }
                }}
              />
              ಅಂತರ್ಜಾತಿ ವಿವಾಹಕ್ಕೆ ಪ್ರೋತ್ಸಾಹ ಧನ
            </CheckboxOption>
            <CheckboxOption>
              <CheckboxInput
                type="checkbox"
                name="facilityType"
                value="sub_caste_marriage"
                checked={formData.facilityType?.includes('sub_caste_marriage')}
                onChange={(e) => {
                  const value = e.target.value;
                  const current = formData.facilityType || [];
                  if (e.target.checked) {
                    setFormData({...formData, facilityType: [...current, value]});
                  } else {
                    setFormData({...formData, facilityType: current.filter(item => item !== value)});
                  }
                }}
              />
              ಒಳಪಂಗಡಗಳ ಅಂತರ್ಜಾತಿ ವಿವಾಹಕ್ಕೆ ಪ್ರೋತ್ಸಾಹ ಧನ
            </CheckboxOption>
            <CheckboxOption>
              <CheckboxInput
                type="checkbox"
                name="facilityType"
                value="widow_remarriage"
                checked={formData.facilityType?.includes('widow_remarriage')}
                onChange={(e) => {
                  const value = e.target.value;
                  const current = formData.facilityType || [];
                  if (e.target.checked) {
                    setFormData({...formData, facilityType: [...current, value]});
                  } else {
                    setFormData({...formData, facilityType: current.filter(item => item !== value)});
                  }
                }}
              />
              ವಿಧವಾ ಮರು ವಿವಾಹಕ್ಕೆ ಪ್ರೋತ್ಸಾಹ ಧನ
            </CheckboxOption>
            <CheckboxOption>
              <CheckboxInput
                type="checkbox"
                name="facilityType"
                value="simple_marriage"
                checked={formData.facilityType?.includes('simple_marriage')}
                onChange={(e) => {
                  const value = e.target.value;
                  const current = formData.facilityType || [];
                  if (e.target.checked) {
                    setFormData({...formData, facilityType: [...current, value]});
                  } else {
                    setFormData({...formData, facilityType: current.filter(item => item !== value)});
                  }
                }}
              />
              ಸರಳ ಸಾಮೂಹಿಕ ವಿವಾಹಕ್ಕೆ ಪ್ರೋತ್ಸಾಹ ಧನ
            </CheckboxOption>
            <CheckboxOption>
              <CheckboxInput
                type="checkbox"
                name="facilityType"
                value="devadasi_children"
                checked={formData.facilityType?.includes('devadasi_children')}
                onChange={(e) => {
                  const value = e.target.value;
                  const current = formData.facilityType || [];
                  if (e.target.checked) {
                    setFormData({...formData, facilityType: [...current, value]});
                  } else {
                    setFormData({...formData, facilityType: current.filter(item => item !== value)});
                  }
                }}
              />
              ಮಾಜಿ ದೇವದಾಸಿ ಮಕ್ಕಳ ವಿವಾಹಕ್ಕೆ ಪ್ರೋತ್ಸಾಹ ಧನ
            </CheckboxOption>
          </CheckboxGroup>
        </FormGroup>
      )}

      {/* Question 3 */}
      <FormGroup>
        <QuestionNumber>3</QuestionNumber>
        <Label>ಅರ್ಜಿದಾರರ ಹೆಸರು</Label>
        <Input
          type="text"
          placeholder="ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ"
          value={formData.applicantName || ''}
          onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
        />
      </FormGroup>

      {/* Question 4 */}
      <FormGroup>
        <QuestionNumber>4</QuestionNumber>
        <Label>ಪತಿ/ಪತ್ನಿಯ ಹೆಸರು</Label>
        <Input
          type="text"
          placeholder="ಪತಿ/ಪತ್ನಿಯ ಹೆಸರು"
          value={formData.spouseName || ''}
          onChange={(e) => setFormData({...formData, spouseName: e.target.value})}
        />
      </FormGroup>

      {/* Question 5 */}
      <FormGroup>
        <QuestionNumber>5</QuestionNumber>
        <Label>ಅರ್ಜಿದಾರರ ಲಿಂಗ</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicantGender"
              value="male"
              checked={formData.applicantGender === 'male'}
              onChange={(e) => setFormData({...formData, applicantGender: e.target.value})}
            />
            ಗಂಡು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicantGender"
              value="female"
              checked={formData.applicantGender === 'female'}
              onChange={(e) => setFormData({...formData, applicantGender: e.target.value})}
            />
            ಹೆಣ್ಣು
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 6 */}
      <FormGroup>
        <QuestionNumber>6</QuestionNumber>
        <Label>ಪತಿ/ಪತ್ನಿಯ ಲಿಂಗ</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseGender"
              value="male"
              checked={formData.spouseGender === 'male'}
              onChange={(e) => setFormData({...formData, spouseGender: e.target.value})}
            />
            ಗಂಡು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseGender"
              value="female"
              checked={formData.spouseGender === 'female'}
              onChange={(e) => setFormData({...formData, spouseGender: e.target.value})}
            />
            ಹೆಣ್ಣು
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 7 */}
      <FormGroup>
        <QuestionNumber>7</QuestionNumber>
        <Label>ಅರ್ಜಿದಾರರು ಯಾವ ವರ್ಗಕ್ಕೆ ಸೇರಿದವರು?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicantCategory"
              value="sc"
              checked={formData.applicantCategory === 'sc'}
              onChange={(e) => setFormData({...formData, applicantCategory: e.target.value})}
            />
            ಎಸ್.ಸಿ.
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicantCategory"
              value="st"
              checked={formData.applicantCategory === 'st'}
              onChange={(e) => setFormData({...formData, applicantCategory: e.target.value})}
            />
            ಎಸ್.ಟಿ.
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 8 - SC Caste Details */}
      {formData.applicantCategory === 'sc' && (
        <>
          <FormGroup>
            <QuestionNumber>8</QuestionNumber>
            <Label>ಎಸ್.ಸಿ. ಆಗಿದ್ದರೆ ಎಸ್.ಸಿ. ಜಾತಿಯನ್ನು ನಮೂದಿಸಿ (101 ಜಾತಿಗಳ ಪಟ್ಟಿಯಿಂದ)</Label>
            <Input
              type="text"
              placeholder="ಜಾತಿಯ ಹೆಸರು"
              value={formData.scCaste || ''}
              onChange={(e) => setFormData({...formData, scCaste: e.target.value})}
            />
          </FormGroup>

          <FormGroup>
            <Label>ಎಸ್.ಸಿ. ಆಗಿದ್ದರೆ ಅಲೆಮಾರಿ/ಅರೆ ಅಲೆಮಾರಿ ಸಮುದಾಯಗಳಿಗೆ ಸೇರಿದ್ದೀರಾ?</Label>
            <RadioGroup>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="isNomadic"
                  value="yes"
                  checked={formData.isNomadic === 'yes'}
                  onChange={(e) => setFormData({...formData, isNomadic: e.target.value})}
                />
                ಹೌದು
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="isNomadic"
                  value="no"
                  checked={formData.isNomadic === 'no'}
                  onChange={(e) => setFormData({...formData, isNomadic: e.target.value})}
                />
                ಇಲ್ಲ
              </RadioOption>
            </RadioGroup>
          </FormGroup>

          {formData.isNomadic === 'yes' && (
            <FormGroup>
              <Label>ಹೌದು ಎಂದಾದಲ್ಲಿ ಜಾತಿಯನ್ನು ನಮೂದಿಸಿ</Label>
              <Input
                type="text"
                placeholder="ನೋಮಾಡಿಕ್ ಜಾತಿಯ ಹೆಸರು"
                value={formData.nomadicCaste || ''}
                onChange={(e) => setFormData({...formData, nomadicCaste: e.target.value})}
              />
            </FormGroup>
          )}
        </>
      )}

      {/* Question 9 - ST Caste Details */}
      {formData.applicantCategory === 'st' && (
        <>
          <FormGroup>
            <QuestionNumber>9</QuestionNumber>
            <Label>ಎಸ್.ಟಿ. ಆಗಿದ್ದರೆ: ಜಾತಿಯನ್ನು ನಮೂದಿಸಿ (50 ಜಾತಿಗಳ ಪಟ್ಟಿಯಿಂದ)</Label>
            <Input
              type="text"
              placeholder="ಜಾತಿಯ ಹೆಸರು"
              value={formData.stCaste || ''}
              onChange={(e) => setFormData({...formData, stCaste: e.target.value})}
            />
          </FormGroup>

          <FormGroup>
            <Label>ನಿರ್ದಿಷ್ಟ ದುರ್ಬಲ ಬುಡಕಟ್ಟು ಗುಂಪು (ಪಿ.ವಿ.ಟಿ.ಜಿ.)</Label>
            <RadioGroup>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="isPVTG"
                  value="yes"
                  checked={formData.isPVTG === 'yes'}
                  onChange={(e) => setFormData({...formData, isPVTG: e.target.value})}
                />
                ಹೌದು
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="isPVTG"
                  value="no"
                  checked={formData.isPVTG === 'no'}
                  onChange={(e) => setFormData({...formData, isPVTG: e.target.value})}
                />
                ಇಲ್ಲ
              </RadioOption>
            </RadioGroup>
          </FormGroup>

          <FormGroup>
            <Label>ಅಲೆಮಾರಿ/ಅರೆ ಅಲೆಮಾರಿ ಬುಡಕಟ್ಟು?</Label>
            <RadioGroup>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="isTribalNomadic"
                  value="yes"
                  checked={formData.isTribalNomadic === 'yes'}
                  onChange={(e) => setFormData({...formData, isTribalNomadic: e.target.value})}
                />
                ಹೌದು
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="isTribalNomadic"
                  value="no"
                  checked={formData.isTribalNomadic === 'no'}
                  onChange={(e) => setFormData({...formData, isTribalNomadic: e.target.value})}
                />
                ಇಲ್ಲ
              </RadioOption>
            </RadioGroup>
          </FormGroup>

          {formData.isTribalNomadic === 'yes' && (
            <FormGroup>
              <Label>ಹೌದು ಎಂದಾದಲ್ಲಿ ಜಾತಿಯನ್ನು ನಮೂದಿಸಿ</Label>
              <Input
                type="text"
                placeholder="ಟ್ರೈಬಲ್ ನೋಮಾಡಿಕ್ ಜಾತಿಯ ಹೆಸರು"
                value={formData.tribalNomadicCaste || ''}
                onChange={(e) => setFormData({...formData, tribalNomadicCaste: e.target.value})}
              />
            </FormGroup>
          )}
        </>
      )}

      {/* Question 10 */}
      <FormGroup>
        <QuestionNumber>10</QuestionNumber>
        <Label>ಪತಿ/ಪತ್ನಿ ಯಾವ ಜಾತಿಗೆ ಸೇರಿದವರು?</Label>
        <Input
          type="text"
          placeholder="ಪತಿ/ಪತ್ನಿಯ ಜಾತಿ"
          value={formData.spouseCaste || ''}
          onChange={(e) => setFormData({...formData, spouseCaste: e.target.value})}
        />
      </FormGroup>

      {/* Question 11 */}
      <FormGroup>
        <QuestionNumber>11</QuestionNumber>
        <Label>ಪತಿ/ಪತ್ನಿ ಯಾವ ಉಪಜಾತಿಗೆ ಸೇರಿದವರು?</Label>
        <Input
          type="text"
          placeholder="ಪತಿ/ಪತ್ನಿಯ ಉಪಜಾತಿ"
          value={formData.spouseSubCaste || ''}
          onChange={(e) => setFormData({...formData, spouseSubCaste: e.target.value})}
        />
      </FormGroup>

      {/* Question 12 */}
      <FormGroup>
        <QuestionNumber>12</QuestionNumber>
        <Label>ವಯಸ್ಸು/ಹುಟ್ಟಿದ ದಿನಾಂಕ (ಸಂದರ್ಶನದ ಸಂದರ್ಭದಲ್ಲಿನ ವಯಸ್ಸು)</Label>
        <Input
          type="number"
          placeholder="ವಯಸ್ಸು"
          value={formData.age || ''}
          onChange={(e) => setFormData({...formData, age: e.target.value})}
        />
      </FormGroup>

      {/* Question 13 */}
      <FormGroup>
        <QuestionNumber>13</QuestionNumber>
        <Label>ಮೊಬೈಲ್ ಸಂಖ್ಯೆ</Label>
        <Input
          type="tel"
          placeholder="ಮೊಬೈಲ್ ಸಂಖ್ಯೆ"
          value={formData.mobileNumber || ''}
          onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
        />
      </FormGroup>

      {/* Question 14 */}
      <FormGroup>
        <QuestionNumber>14</QuestionNumber>
        <Label>ವಿವಾಹವಾದ ದಿನಾಂಕ</Label>
        <Input
          type="date"
          value={formData.marriageDate || ''}
          onChange={(e) => setFormData({...formData, marriageDate: e.target.value})}
        />
      </FormGroup>

      {/* Question 15 */}
      <FormGroup>
        <QuestionNumber>15</QuestionNumber>
        <Label>ವಿವಾಹ ನೋಂದಣಿ ದಿನಾಂಕ/ತಿಂಗಳು ಮತ್ತು ವರ್ಷ</Label>
        <Input
          type="date"
          value={formData.marriageRegistrationDate || ''}
          onChange={(e) => setFormData({...formData, marriageRegistrationDate: e.target.value})}
        />
      </FormGroup>

      {/* Question 16 */}
      <FormGroup>
        <QuestionNumber>16</QuestionNumber>
        <Label>ವಿವಾಹವನ್ನು ಆಯೋಜಿಸಿರುವ ಸಂಸ್ಥೆಯನ್ನು ಹೆಸರಿಸಿ (ಸರಳ/ಸಾಮೂಹಿಕ ವಿವಾಹಕ್ಕೆ ಮಾತ್ರ)</Label>
        <Input
          type="text"
          placeholder="ಸಂಸ್ಥೆಯ ಹೆಸರು"
          value={formData.organizingInstitution || ''}
          onChange={(e) => setFormData({...formData, organizingInstitution: e.target.value})}
        />
      </FormGroup>

      {/* Question 17 */}
      <FormGroup>
        <QuestionNumber>17</QuestionNumber>
        <Label>ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ ದಿನಾಂಕ/ತಿಂಗಳು ಮತ್ತು ವರ್ಷವನ್ನು ನಮೂದಿಸಿ</Label>
        <Input
          type="date"
          value={formData.applicationDate || ''}
          onChange={(e) => setFormData({...formData, applicationDate: e.target.value})}
        />
      </FormGroup>

      {/* Question 18 */}
      <FormGroup>
        <QuestionNumber>18</QuestionNumber>
        <Label>ಸೌಲಭ್ಯ ಮಂಜೂರಾದ ದಿನಾಂಕ/ತಿಂಗಳು ಮತ್ತು ವರ್ಷವನ್ನು ನಮೂದಿಸಿ</Label>
        <Input
          type="date"
          value={formData.approvalDate || ''}
          onChange={(e) => setFormData({...formData, approvalDate: e.target.value})}
        />
      </FormGroup>

      {/* Question 19 */}
      <FormGroup>
        <QuestionNumber>19</QuestionNumber>
        <Label>ಸೌಲಭ್ಯ ಪಡೆದ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ</Label>
        <Input
          type="number"
          placeholder="ಮೊತ್ತ ₹"
          value={formData.benefitAmount || ''}
          onChange={(e) => setFormData({...formData, benefitAmount: e.target.value})}
        />
      </FormGroup>

      {/* Question 20 */}
      <FormGroup>
        <QuestionNumber>20</QuestionNumber>
        <Label>ಅಂತರ್ಜಾತಿ ವಿವಾಹಕ್ಕೆ ಪ್ರೋತ್ಸಾಹ ಧನ ಆಗಿದ್ದಲ್ಲಿ, 50% ಮೊತ್ತವನ್ನು ನಿಶ್ಚಿತ ಠೇವಣಿಯಾಗಿ (FD) ಇಡಲಾಗಿದೆಯೇ? ಹಾಗೂ ಈ ಬಗ್ಗೆ ನಿಶ್ಚಿತ ಠೇವಣಿಯ ಪ್ರಮಾಣ ಪತ್ರ ನೀಡಿರುತ್ತಾರೆಯೇ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="fixedDepositStatus"
              value="yes"
              checked={formData.fixedDepositStatus === 'yes'}
              onChange={(e) => setFormData({...formData, fixedDepositStatus: e.target.value})}
            />
            ಹೌದು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="fixedDepositStatus"
              value="no"
              checked={formData.fixedDepositStatus === 'no'}
              onChange={(e) => setFormData({...formData, fixedDepositStatus: e.target.value})}
            />
            ಇಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 21 */}
      <FormGroup>
        <QuestionNumber>21</QuestionNumber>
        <Label>ನೀವು ಮತ್ತು ನಿಮ್ಮ ಪತಿ/ಪತ್ನಿ ಜಂಟಿ ಬ್ಯಾಂಕ್ ಖಾತೆಯನ್ನು ಹೊಂದಿದ್ದೀರಾ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="hasJointAccount"
              value="yes"
              checked={formData.hasJointAccount === 'yes'}
              onChange={(e) => setFormData({...formData, hasJointAccount: e.target.value})}
            />
            ಹೌದು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="hasJointAccount"
              value="no"
              checked={formData.hasJointAccount === 'no'}
              onChange={(e) => setFormData({...formData, hasJointAccount: e.target.value})}
            />
            ಇಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 22 */}
      <FormGroup>
        <QuestionNumber>22</QuestionNumber>
        <Label>ಅರ್ಜಿದಾರರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಮೊತ್ತ ಜಮೆಯಾದ ತಿಂಗಳು ಮತ್ತು ವರ್ಷವನ್ನು ನಮೂದಿಸಿ</Label>
        <Input
          type="month"
          value={formData.amountCreditedDate || ''}
          onChange={(e) => setFormData({...formData, amountCreditedDate: e.target.value})}
        />
      </FormGroup>

      {/* Question 23 */}
      <FormGroup>
        <QuestionNumber>23</QuestionNumber>
        <Label>ಅರ್ಜಿದಾರರ ಶೈಕ್ಷಣಿಕ ಅರ್ಹತೆ</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicantEducation"
              value="no_school"
              checked={formData.applicantEducation === 'no_school'}
              onChange={(e) => setFormData({...formData, applicantEducation: e.target.value})}
            />
            ಶಾಲಾ ಶಿಕ್ಷಣ ಪಡೆದಿಲ್ಲ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicantEducation"
              value="up_to_5th"
              checked={formData.applicantEducation === 'up_to_5th'}
              onChange={(e) => setFormData({...formData, applicantEducation: e.target.value})}
            />
            5 ನೇ ತರಗತಿಯೊಳಗೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicantEducation"
              value="up_to_10th"
              checked={formData.applicantEducation === 'up_to_10th'}
              onChange={(e) => setFormData({...formData, applicantEducation: e.target.value})}
            />
            10 ಮತ್ತು 10ನೇ ತರಗತಿಯೊಳಗೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicantEducation"
              value="12th_grade"
              checked={formData.applicantEducation === '12th_grade'}
              onChange={(e) => setFormData({...formData, applicantEducation: e.target.value})}
            />
            12 ನೇ ತರಗತಿ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicantEducation"
              value="graduation"
              checked={formData.applicantEducation === 'graduation'}
              onChange={(e) => setFormData({...formData, applicantEducation: e.target.value})}
            />
            ಪದವಿ/ಡಿಪ್ಲೊಮಾ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicantEducation"
              value="post_graduation"
              checked={formData.applicantEducation === 'post_graduation'}
              onChange={(e) => setFormData({...formData, applicantEducation: e.target.value})}
            />
            ಸ್ನಾತಕೋತ್ತರ ಮತ್ತು ಅದಕ್ಕಿಂತ ಹೆಚ್ಚಿನ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 24 */}
      <FormGroup>
        <QuestionNumber>24</QuestionNumber>
        <Label>ಪತಿ/ಪತ್ನಿ ಶೈಕ್ಷಣಿಕ ಅರ್ಹತೆ</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseEducation"
              value="no_school"
              checked={formData.spouseEducation === 'no_school'}
              onChange={(e) => setFormData({...formData, spouseEducation: e.target.value})}
            />
            ಶಾಲಾ ಶಿಕ್ಷಣ ಪಡೆದಿಲ್ಲ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseEducation"
              value="up_to_5th"
              checked={formData.spouseEducation === 'up_to_5th'}
              onChange={(e) => setFormData({...formData, spouseEducation: e.target.value})}
            />
            5 ನೇ ತರಗತಿಯೊಳಗೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseEducation"
              value="up_to_10th"
              checked={formData.spouseEducation === 'up_to_10th'}
              onChange={(e) => setFormData({...formData, spouseEducation: e.target.value})}
            />
            10 ಮತ್ತು 10ನೇ ತರಗತಿಯೊಳಗೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseEducation"
              value="12th_grade"
              checked={formData.spouseEducation === '12th_grade'}
              onChange={(e) => setFormData({...formData, spouseEducation: e.target.value})}
            />
            12 ನೇ ತರಗತಿ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseEducation"
              value="graduation"
              checked={formData.spouseEducation === 'graduation'}
              onChange={(e) => setFormData({...formData, spouseEducation: e.target.value})}
            />
            ಪದವಿ/ಡಿಪ್ಲೊಮಾ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseEducation"
              value="post_graduation"
              checked={formData.spouseEducation === 'post_graduation'}
              onChange={(e) => setFormData({...formData, spouseEducation: e.target.value})}
            />
            ಸ್ನಾತಕೋತ್ತರ ಮತ್ತು ಅದಕ್ಕಿಂತ ಹೆಚ್ಚಿನ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 34 */}
      <FormGroup>
        <QuestionNumber>25</QuestionNumber>
        <Label>ವಿವಿಧ ವಿವಾಹಗಳ ಪ್ರೋತ್ಸಾಹಧನ ಯೋಜನೆಗಳಡಿ ಪಡೆದ ಸೌಲಭ್ಯವನ್ನು ನೀವು ಹೇಗೆ ಬಳಸಿಕೊಂಡಿದ್ದೀರಿ?</Label>
        <CheckboxGroup>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="benefitUsage"
              value="house_construction"
              checked={formData.benefitUsage?.includes('house_construction')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.benefitUsage || [];
                if (e.target.checked) {
                  setFormData({...formData, benefitUsage: [...current, value]});
                } else {
                  setFormData({...formData, benefitUsage: current.filter(item => item !== value)});
                }
              }}
            />
            ಮನೆ ನಿರ್ಮಾಣ
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="benefitUsage"
              value="business_start"
              checked={formData.benefitUsage?.includes('business_start')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.benefitUsage || [];
                if (e.target.checked) {
                  setFormData({...formData, benefitUsage: [...current, value]});
                } else {
                  setFormData({...formData, benefitUsage: current.filter(item => item !== value)});
                }
              }}
            />
            ವ್ಯಾಪಾರ ಪ್ರಾರಂಭ ಅಥವಾ ವಿಸ್ತರಣೆ
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="benefitUsage"
              value="education_expenses"
              checked={formData.benefitUsage?.includes('education_expenses')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.benefitUsage || [];
                if (e.target.checked) {
                  setFormData({...formData, benefitUsage: [...current, value]});
                } else {
                  setFormData({...formData, benefitUsage: current.filter(item => item !== value)});
                }
              }}
            />
            ಶಿಕ್ಷಣ ವೆಚ್ಚಗಳು
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="benefitUsage"
              value="medical_needs"
              checked={formData.benefitUsage?.includes('medical_needs')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.benefitUsage || [];
                if (e.target.checked) {
                  setFormData({...formData, benefitUsage: [...current, value]});
                } else {
                  setFormData({...formData, benefitUsage: current.filter(item => item !== value)});
                }
              }}
            />
            ವೈದ್ಯಕೀಯ ಅಗತ್ಯಗಳು
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="benefitUsage"
              value="daily_expenses"
              checked={formData.benefitUsage?.includes('daily_expenses')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.benefitUsage || [];
                if (e.target.checked) {
                  setFormData({...formData, benefitUsage: [...current, value]});
                } else {
                  setFormData({...formData, benefitUsage: current.filter(item => item !== value)});
                }
              }}
            />
            ದೈನಂದಿನ ಮನೆಯ ವೆಚ್ಚಗಳು
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="benefitUsage"
              value="savings"
              checked={formData.benefitUsage?.includes('savings')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.benefitUsage || [];
                if (e.target.checked) {
                  setFormData({...formData, benefitUsage: [...current, value]});
                } else {
                  setFormData({...formData, benefitUsage: current.filter(item => item !== value)});
                }
              }}
            />
            ಉಳಿತಾಯ (ಉದಾ. ಸ್ಥಿರ ಠೇವಣಿ)
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="benefitUsage"
              value="other"
              checked={formData.benefitUsage?.includes('other')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.benefitUsage || [];
                if (e.target.checked) {
                  setFormData({...formData, benefitUsage: [...current, value]});
                } else {
                  setFormData({...formData, benefitUsage: current.filter(item => item !== value)});
                }
              }}
            />
            ಇತರೆ
          </CheckboxOption>
        </CheckboxGroup>
        {formData.benefitUsage?.includes('other') && (
          <Input
            type="text"
            placeholder="ಇತರೆ ಬಳಕೆ ನಮೂದಿಸಿ"
            value={formData.benefitUsageOther || ''}
            onChange={(e) => setFormData({...formData, benefitUsageOther: e.target.value})}
            style={{marginTop: '10px'}}
          />
        )}
      </FormGroup>
    </div>
  );

  // Render Section 2 - ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಮತ್ತು ಜೀವನೋಪಾಯದ ಪರಿಣಾಮ
  const renderSection2 = () => (
    <div>
      {/* Question 1 */}
      <FormGroup>
        <QuestionNumber>1</QuestionNumber>
        <Label>ಸದರಿ ಸೌಲಭ್ಯವನ್ನು ಪಡೆದ ನಂತರ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಆದಾಯದ ಮೂಲ ಅಥವಾ ಉದ್ಯೋಗ ಯಾವುದು?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentIncomeSource"
              value="government_job"
              checked={formData.currentIncomeSource === 'government_job'}
              onChange={(e) => setFormData({...formData, currentIncomeSource: e.target.value})}
            />
            ಸರ್ಕಾರಿ ಉದ್ಯೋಗ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentIncomeSource"
              value="private_job"
              checked={formData.currentIncomeSource === 'private_job'}
              onChange={(e) => setFormData({...formData, currentIncomeSource: e.target.value})}
            />
            ಖಾಸಗಿ ಉದ್ಯೋಗ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentIncomeSource"
              value="self_employed"
              checked={formData.currentIncomeSource === 'self_employed'}
              onChange={(e) => setFormData({...formData, currentIncomeSource: e.target.value})}
            />
            ಸ್ವ-ಉದ್ಯೋಗ (ಉದಾ. ವ್ಯಾಪಾರ, ಟೈಲರಿಂಗ್ ಇತ್ಯಾದಿ)
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentIncomeSource"
              value="daily_wage"
              checked={formData.currentIncomeSource === 'daily_wage'}
              onChange={(e) => setFormData({...formData, currentIncomeSource: e.target.value})}
            />
            ದಿನಗೂಲಿ ಕಾರ್ಮಿಕ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentIncomeSource"
              value="agriculture"
              checked={formData.currentIncomeSource === 'agriculture'}
              onChange={(e) => setFormData({...formData, currentIncomeSource: e.target.value})}
            />
            ಕೃಷಿ/ತೋಟಗಾರಿಕೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentIncomeSource"
              value="housewife"
              checked={formData.currentIncomeSource === 'housewife'}
              onChange={(e) => setFormData({...formData, currentIncomeSource: e.target.value})}
            />
            ಗೃಹಿಣಿ (ವೈಯಕ್ತಿಕ ಆದಾಯವಿಲ್ಲ)
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentIncomeSource"
              value="unemployed"
              checked={formData.currentIncomeSource === 'unemployed'}
              onChange={(e) => setFormData({...formData, currentIncomeSource: e.target.value})}
            />
            ನಿರುದ್ಯೋಗಿ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentIncomeSource"
              value="other"
              checked={formData.currentIncomeSource === 'other'}
              onChange={(e) => setFormData({...formData, currentIncomeSource: e.target.value})}
            />
            ಇತರೆ
          </RadioOption>
        </RadioGroup>
        {formData.currentIncomeSource === 'other' && (
          <Input
            type="text"
            placeholder="ದಯವಿಟ್ಟು ನಮೂದಿಸಿ"
            value={formData.currentIncomeSourceOther || ''}
            onChange={(e) => setFormData({...formData, currentIncomeSourceOther: e.target.value})}
            style={{marginTop: '10px'}}
          />
        )}
      </FormGroup>

      {/* Question 2 */}
      <FormGroup>
        <QuestionNumber>2</QuestionNumber>
        <Label>ಸೌಲಭ್ಯವನ್ನು ಪಡೆದ ನಂತರ ನಿಮ್ಮ ಪತಿ/ಪತ್ನಿಯ ಪ್ರಸ್ತುತ ಆದಾಯದ ಮೂಲ ಅಥವಾ ಉದ್ಯೋಗ ಯಾವುದು?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseCurrentIncomeSource"
              value="government_job"
              checked={formData.spouseCurrentIncomeSource === 'government_job'}
              onChange={(e) => setFormData({...formData, spouseCurrentIncomeSource: e.target.value})}
            />
            ಸರ್ಕಾರಿ ಉದ್ಯೋಗ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseCurrentIncomeSource"
              value="private_job"
              checked={formData.spouseCurrentIncomeSource === 'private_job'}
              onChange={(e) => setFormData({...formData, spouseCurrentIncomeSource: e.target.value})}
            />
            ಖಾಸಗಿ ಉದ್ಯೋಗ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseCurrentIncomeSource"
              value="self_employed"
              checked={formData.spouseCurrentIncomeSource === 'self_employed'}
              onChange={(e) => setFormData({...formData, spouseCurrentIncomeSource: e.target.value})}
            />
            ಸ್ವ-ಉದ್ಯೋಗ (ಉದಾ. ವ್ಯಾಪಾರ, ಟೈಲರಿಂಗ್ ಇತ್ಯಾದಿ)
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseCurrentIncomeSource"
              value="daily_wage"
              checked={formData.spouseCurrentIncomeSource === 'daily_wage'}
              onChange={(e) => setFormData({...formData, spouseCurrentIncomeSource: e.target.value})}
            />
            ದಿನಗೂಲಿ ಕಾರ್ಮಿಕ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseCurrentIncomeSource"
              value="agriculture"
              checked={formData.spouseCurrentIncomeSource === 'agriculture'}
              onChange={(e) => setFormData({...formData, spouseCurrentIncomeSource: e.target.value})}
            />
            ಕೃಷಿ/ತೋಟಗಾರಿಕೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseCurrentIncomeSource"
              value="housewife"
              checked={formData.spouseCurrentIncomeSource === 'housewife'}
              onChange={(e) => setFormData({...formData, spouseCurrentIncomeSource: e.target.value})}
            />
            ಗೃಹಿಣಿ (ವೈಯಕ್ತಿಕ ಆದಾಯವಿಲ್ಲ)
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseCurrentIncomeSource"
              value="unemployed"
              checked={formData.spouseCurrentIncomeSource === 'unemployed'}
              onChange={(e) => setFormData({...formData, spouseCurrentIncomeSource: e.target.value})}
            />
            ನಿರುದ್ಯೋಗಿ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="spouseCurrentIncomeSource"
              value="other"
              checked={formData.spouseCurrentIncomeSource === 'other'}
              onChange={(e) => setFormData({...formData, spouseCurrentIncomeSource: e.target.value})}
            />
            ಇತರೆ
          </RadioOption>
        </RadioGroup>
        {formData.spouseCurrentIncomeSource === 'other' && (
          <Input
            type="text"
            placeholder="ದಯವಿಟ್ಟು ನಮೂದಿಸಿ"
            value={formData.spouseCurrentIncomeSourceOther || ''}
            onChange={(e) => setFormData({...formData, spouseCurrentIncomeSourceOther: e.target.value})}
            style={{marginTop: '10px'}}
          />
        )}
      </FormGroup>

      {/* Question 3 */}
      <FormGroup>
        <QuestionNumber>3</QuestionNumber>
        <Label>ಸೌಲಭ್ಯವನ್ನು ಪಡೆದ ನಂತರ / ಪ್ರಸ್ತುತ ನಿಮ್ಮ ಕುಟುಂಬದ ಒಟ್ಟು ವಾರ್ಷಿಕ ಆದಾಯ ಎಷ್ಟು?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentFamilyIncome"
              value="below_50000"
              checked={formData.currentFamilyIncome === 'below_50000'}
              onChange={(e) => setFormData({...formData, currentFamilyIncome: e.target.value})}
            />
            ₹50,000 ಕ್ಕಿಂತ ಕಡಿಮೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentFamilyIncome"
              value="50001_100000"
              checked={formData.currentFamilyIncome === '50001_100000'}
              onChange={(e) => setFormData({...formData, currentFamilyIncome: e.target.value})}
            />
            ₹50,001 - ₹1,00,000
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentFamilyIncome"
              value="100001_200000"
              checked={formData.currentFamilyIncome === '100001_200000'}
              onChange={(e) => setFormData({...formData, currentFamilyIncome: e.target.value})}
            />
            ₹1,00,001 - ₹2,00,000
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentFamilyIncome"
              value="200001_300000"
              checked={formData.currentFamilyIncome === '200001_300000'}
              onChange={(e) => setFormData({...formData, currentFamilyIncome: e.target.value})}
            />
            ₹2,00,001 - ₹3,00,000
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentFamilyIncome"
              value="300001_500000"
              checked={formData.currentFamilyIncome === '300001_500000'}
              onChange={(e) => setFormData({...formData, currentFamilyIncome: e.target.value})}
            />
            ₹3,00,001 - ₹5,00,000
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentFamilyIncome"
              value="above_500000"
              checked={formData.currentFamilyIncome === 'above_500000'}
              onChange={(e) => setFormData({...formData, currentFamilyIncome: e.target.value})}
            />
            ₹5,00,000 ಕ್ಕಿಂತ ಹೆಚ್ಚು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="currentFamilyIncome"
              value="prefer_not_to_say"
              checked={formData.currentFamilyIncome === 'prefer_not_to_say'}
              onChange={(e) => setFormData({...formData, currentFamilyIncome: e.target.value})}
            />
            ಹೇಳಲು ಇಷ್ಟಪಡುವುದಿಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 4 */}
      <FormGroup>
        <QuestionNumber>4</QuestionNumber>
        <Label>ಸೌಲಭ್ಯವನ್ನು ಪಡೆದ ನಂತರ ನಿಮ್ಮ ಜೀವನ ಮಟ್ಟ ಸುಧಾರಿಸಿದೆಯೇ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="livingStandardImprovement"
              value="much_improved"
              checked={formData.livingStandardImprovement === 'much_improved'}
              onChange={(e) => setFormData({...formData, livingStandardImprovement: e.target.value})}
            />
            ಬಹಳ ಸುಧಾರಿಸಿದೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="livingStandardImprovement"
              value="somewhat_improved"
              checked={formData.livingStandardImprovement === 'somewhat_improved'}
              onChange={(e) => setFormData({...formData, livingStandardImprovement: e.target.value})}
            />
            ಸ್ವಲ್ಪ ಸುಧಾರಿಸಿದೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="livingStandardImprovement"
              value="no_change"
              checked={formData.livingStandardImprovement === 'no_change'}
              onChange={(e) => setFormData({...formData, livingStandardImprovement: e.target.value})}
            />
            ಯಾವುದೇ ಬದಲಾವಣೆ ಇಲ್ಲ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="livingStandardImprovement"
              value="prefer_not_to_say"
              checked={formData.livingStandardImprovement === 'prefer_not_to_say'}
              onChange={(e) => setFormData({...formData, livingStandardImprovement: e.target.value})}
            />
            ಹೇಳಲು ಇಷ್ಟಪಡುವುದಿಲ್ಲ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="livingStandardImprovement"
              value="not_sure"
              checked={formData.livingStandardImprovement === 'not_sure'}
              onChange={(e) => setFormData({...formData, livingStandardImprovement: e.target.value})}
            />
            ಖಚಿತತೆ ಇಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 5 */}
      <FormGroup>
        <QuestionNumber>5</QuestionNumber>
        <Label>ಸೌಲಭ್ಯವನ್ನು ಪಡೆದ ನಂತರ ಮೂಲಭೂತ ಅಗತ್ಯಗಳಾದ ವಿದ್ಯುತ್, ಶುದ್ಧ ನೀರು, ಶೌಚಾಲಯ, ವಸತಿ, ಅಡುಗೆ ಅನಿಲ ಅಥವಾ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಹೊಂದುವಲ್ಲಿ ನಿಮ್ಮ ಸ್ಥಿತಿ ಸುಧಾರಿಸಿದೆಯೇ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="basicNeedsImprovement"
              value="much_improved"
              checked={formData.basicNeedsImprovement === 'much_improved'}
              onChange={(e) => setFormData({...formData, basicNeedsImprovement: e.target.value})}
            />
            ಬಹಳ ಸುಧಾರಿಸಿದೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="basicNeedsImprovement"
              value="somewhat_improved"
              checked={formData.basicNeedsImprovement === 'somewhat_improved'}
              onChange={(e) => setFormData({...formData, basicNeedsImprovement: e.target.value})}
            />
            ಸ್ವಲ್ಪ ಸುಧಾರಿಸಿದೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="basicNeedsImprovement"
              value="no_change"
              checked={formData.basicNeedsImprovement === 'no_change'}
              onChange={(e) => setFormData({...formData, basicNeedsImprovement: e.target.value})}
            />
            ಯಾವುದೇ ಬದಲಾವಣೆ ಇಲ್ಲ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="basicNeedsImprovement"
              value="worse"
              checked={formData.basicNeedsImprovement === 'worse'}
              onChange={(e) => setFormData({...formData, basicNeedsImprovement: e.target.value})}
            />
            ಕೆಟ್ಟದಾಗಿದೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="basicNeedsImprovement"
              value="not_applicable"
              checked={formData.basicNeedsImprovement === 'not_applicable'}
              onChange={(e) => setFormData({...formData, basicNeedsImprovement: e.target.value})}
            />
            ಅನ್ವಯಿಸುವುದಿಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 6 */}
      <FormGroup>
        <QuestionNumber>6</QuestionNumber>
        <Label>ಈ ಸೌಲಭ್ಯ ನನ್ನ ಸಾಮಾಜಿಕ ಸ್ಥಿತಿಗತಿಯಲ್ಲಿ ಸಕಾರಾತ್ಮಕ ಬದಲಾವಣೆಯನ್ನು ತಂದಿದೆ.</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="socialStatusChange"
              value="strongly_agree"
              checked={formData.socialStatusChange === 'strongly_agree'}
              onChange={(e) => setFormData({...formData, socialStatusChange: e.target.value})}
            />
            ಖಂಡಿತ ಒಪ್ಪುತ್ತೇನೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="socialStatusChange"
              value="agree"
              checked={formData.socialStatusChange === 'agree'}
              onChange={(e) => setFormData({...formData, socialStatusChange: e.target.value})}
            />
            ಒಪ್ಪುತ್ತೇನೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="socialStatusChange"
              value="neutral"
              checked={formData.socialStatusChange === 'neutral'}
              onChange={(e) => setFormData({...formData, socialStatusChange: e.target.value})}
            />
            ತಟಸ್ಥ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="socialStatusChange"
              value="disagree"
              checked={formData.socialStatusChange === 'disagree'}
              onChange={(e) => setFormData({...formData, socialStatusChange: e.target.value})}
            />
            ಒಪ್ಪುವುದಿಲ್ಲ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="socialStatusChange"
              value="strongly_disagree"
              checked={formData.socialStatusChange === 'strongly_disagree'}
              onChange={(e) => setFormData({...formData, socialStatusChange: e.target.value})}
            />
            ತೀವ್ರವಾಗಿ ಒಪ್ಪುವುದಿಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>
    </div>
  );

  // Render Section 3 - ಸಾಮಾಜಿಕ ಒಳಗೊಳ್ಳುವಿಕೆ ಮತ್ತು ಭದ್ರತೆ
  const renderSection3 = () => (
    <div>
      {/* Question 1 */}
      <FormGroup>
        <QuestionNumber>1</QuestionNumber>
        <Label>ನಿಮ್ಮ ಕುಟುಂಬ ಅಥವಾ ನಿಮ್ಮ ಪತಿ/ಪತ್ನಿಯ ಕುಟುಂಬವು ವಿವಾಹವನ್ನು ವಿರೋಧಿಸಿದೆಯೇ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="familyOpposition"
              value="yes"
              checked={formData.familyOpposition === 'yes'}
              onChange={(e) => setFormData({...formData, familyOpposition: e.target.value})}
            />
            ಹೌದು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="familyOpposition"
              value="no"
              checked={formData.familyOpposition === 'no'}
              onChange={(e) => setFormData({...formData, familyOpposition: e.target.value})}
            />
            ಇಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 5 */}
      <FormGroup>
        <QuestionNumber>5</QuestionNumber>
        <Label>ನೀವು ಮತ್ತು ನಿಮ್ಮ ಪತಿ/ಪತ್ನಿ ವಿವಾಹದ ನಂತರ ಯಾವುದೇ ಸವಾಲುಗಳನ್ನು ಎದುರಿಸಿದ್ದೀರಾ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="facedChallenges"
              value="yes"
              checked={formData.facedChallenges === 'yes'}
              onChange={(e) => setFormData({...formData, facedChallenges: e.target.value})}
            />
            ಹೌದು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="facedChallenges"
              value="no"
              checked={formData.facedChallenges === 'no'}
              onChange={(e) => setFormData({...formData, facedChallenges: e.target.value})}
            />
            ಇಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 17 */}
      <FormGroup>
        <QuestionNumber>17</QuestionNumber>
        <Label>ಸೌಲಭ್ಯವನ್ನು ಪಡೆದ ನಂತರ ನಿಮ್ಮ ಸಮುದಾಯದಲ್ಲಿ ನೀವು ಸುರಕ್ಷಿತ ಎಂದು ಭಾವಿಸುತ್ತೀರಾ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="feelingSafe"
              value="much_safer"
              checked={formData.feelingSafe === 'much_safer'}
              onChange={(e) => setFormData({...formData, feelingSafe: e.target.value})}
            />
            ಹೌದು - ಹೆಚ್ಚು ಸುರಕ್ಷಿತ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="feelingSafe"
              value="somewhat_safer"
              checked={formData.feelingSafe === 'somewhat_safer'}
              onChange={(e) => setFormData({...formData, feelingSafe: e.target.value})}
            />
            ಹೌದು - ಸ್ವಲ್ಪ ಸುರಕ್ಷಿತ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="feelingSafe"
              value="no_change"
              checked={formData.feelingSafe === 'no_change'}
              onChange={(e) => setFormData({...formData, feelingSafe: e.target.value})}
            />
            ಯಾವುದೇ ಬದಲಾವಣೆ ಇಲ್ಲ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="feelingSafe"
              value="less_safe"
              checked={formData.feelingSafe === 'less_safe'}
              onChange={(e) => setFormData({...formData, feelingSafe: e.target.value})}
            />
            ಕಡಿಮೆ ಸುರಕ್ಷಿತ ಎಂಬ ಭಾವನೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="feelingSafe"
              value="not_sure"
              checked={formData.feelingSafe === 'not_sure'}
              onChange={(e) => setFormData({...formData, feelingSafe: e.target.value})}
            />
            ಖಚಿತತೆ ಇಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>
    </div>
  );

  // Render Section 4 - ಜಾಗೃತಿ, ಪ್ರಕ್ರಿಯೆ ಮತ್ತು ಸೇವೆಯ ಗುಣಮಟ್ಟ
  const renderSection4 = () => (
    <div>
      {/* Question 1 */}
      <FormGroup>
        <QuestionNumber>1</QuestionNumber>
        <Label>ಈ ಸೌಲಭ್ಯದ ಬಗ್ಗೆ ನಿಮಗೆ ಯಾರಿಂದ ಅರಿವು ಮೂಡಿರುತ್ತದೆ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="awarenessSource"
              value="government_official"
              checked={formData.awarenessSource === 'government_official'}
              onChange={(e) => setFormData({...formData, awarenessSource: e.target.value})}
            />
            ಸರ್ಕಾರಿ ಅಧಿಕಾರಿ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="awarenessSource"
              value="community_leader"
              checked={formData.awarenessSource === 'community_leader'}
              onChange={(e) => setFormData({...formData, awarenessSource: e.target.value})}
            />
            ಸಮುದಾಯದ ನಾಯಕರು ಅಥವಾ ಸ್ಥಳೀಯ ಪ್ರತಿನಿಧಿ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="awarenessSource"
              value="panchayat_ward"
              checked={formData.awarenessSource === 'panchayat_ward'}
              onChange={(e) => setFormData({...formData, awarenessSource: e.target.value})}
            />
            ಪಂಚಾಯತಿ ಅಥವಾ ವಾರ್ಡ್ ಸದಸ್ಯರು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="awarenessSource"
              value="friends_family"
              checked={formData.awarenessSource === 'friends_family'}
              onChange={(e) => setFormData({...formData, awarenessSource: e.target.value})}
            />
            ಸ್ನೇಹಿತರು ಅಥವಾ ಕುಟುಂಬ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="awarenessSource"
              value="media"
              checked={formData.awarenessSource === 'media'}
              onChange={(e) => setFormData({...formData, awarenessSource: e.target.value})}
            />
            ದೂರದರ್ಶನ, ರೇಡಿಯೋ ಅಥವಾ ಪತ್ರಿಕೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="awarenessSource"
              value="social_media"
              checked={formData.awarenessSource === 'social_media'}
              onChange={(e) => setFormData({...formData, awarenessSource: e.target.value})}
            />
            ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 2 */}
      <FormGroup>
        <QuestionNumber>2</QuestionNumber>
        <Label>ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ಅಧಿಕಾರಿಗಳು ಎಷ್ಟು ಬೆಂಬಲ ನೀಡಿದರು?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="officialSupport"
              value="no_support"
              checked={formData.officialSupport === 'no_support'}
              onChange={(e) => setFormData({...formData, officialSupport: e.target.value})}
            />
            ಯಾವುದೇ ಬೆಂಬಲ ನೀಡಲಿಲ್ಲ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="officialSupport"
              value="little_support"
              checked={formData.officialSupport === 'little_support'}
              onChange={(e) => setFormData({...formData, officialSupport: e.target.value})}
            />
            ಸ್ವಲ್ಪ ಬೆಂಬಲ ನೀಡಿದರು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="officialSupport"
              value="moderate_support"
              checked={formData.officialSupport === 'moderate_support'}
              onChange={(e) => setFormData({...formData, officialSupport: e.target.value})}
            />
            ಸಾಧಾರಣ ಬೆಂಬಲ ನೀಡಿದರು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="officialSupport"
              value="good_support"
              checked={formData.officialSupport === 'good_support'}
              onChange={(e) => setFormData({...formData, officialSupport: e.target.value})}
            />
            ಬಹಳ ಬೆಂಬಲ ನೀಡಿದರು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="officialSupport"
              value="excellent_support"
              checked={formData.officialSupport === 'excellent_support'}
              onChange={(e) => setFormData({...formData, officialSupport: e.target.value})}
            />
            ಅತ್ಯಂತ ಹೆಚ್ಚು ಬೆಂಬಲ ನೀಡಿದರು
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 3 */}
      <FormGroup>
        <QuestionNumber>3</QuestionNumber>
        <Label>ಯೋಜನೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಪ್ರಕ್ರಿಯೆಯು ಎಷ್ಟು ಸುಲಭ ಅಥವಾ ಕಷ್ಟಕರವಾಗಿತ್ತು?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicationProcess"
              value="very_easy"
              checked={formData.applicationProcess === 'very_easy'}
              onChange={(e) => setFormData({...formData, applicationProcess: e.target.value})}
            />
            ಅತಿ ಸುಲಭ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicationProcess"
              value="easy"
              checked={formData.applicationProcess === 'easy'}
              onChange={(e) => setFormData({...formData, applicationProcess: e.target.value})}
            />
            ಸುಲಭ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicationProcess"
              value="moderate"
              checked={formData.applicationProcess === 'moderate'}
              onChange={(e) => setFormData({...formData, applicationProcess: e.target.value})}
            />
            ಸಾಧಾರಣ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="applicationProcess"
              value="difficult"
              checked={formData.applicationProcess === 'difficult'}
              onChange={(e) => setFormData({...formData, applicationProcess: e.target.value})}
            />
            ಕಠಿಣ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 4 */}
      <FormGroup>
        <QuestionNumber>4</QuestionNumber>
        <Label>ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ ನಂತರ ಸೌಲಭ್ಯವನ್ನು ಪಡೆಯಲು ಎಷ್ಟು ಸಮಯ ತೆಗೆದುಕೊಂಡಿತು?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="processingTime"
              value="less_than_3_months"
              checked={formData.processingTime === 'less_than_3_months'}
              onChange={(e) => setFormData({...formData, processingTime: e.target.value})}
            />
            3 ತಿಂಗಳಿಗಿಂತ ಕಡಿಮೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="processingTime"
              value="3_to_6_months"
              checked={formData.processingTime === '3_to_6_months'}
              onChange={(e) => setFormData({...formData, processingTime: e.target.value})}
            />
            3-6 ತಿಂಗಳುಗಳು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="processingTime"
              value="6_to_12_months"
              checked={formData.processingTime === '6_to_12_months'}
              onChange={(e) => setFormData({...formData, processingTime: e.target.value})}
            />
            6-12 ತಿಂಗಳುಗಳು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="processingTime"
              value="1_to_2_years"
              checked={formData.processingTime === '1_to_2_years'}
              onChange={(e) => setFormData({...formData, processingTime: e.target.value})}
            />
            1 ರಿಂದ 2 ವರ್ಷ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="processingTime"
              value="not_received_yet"
              checked={formData.processingTime === 'not_received_yet'}
              onChange={(e) => setFormData({...formData, processingTime: e.target.value})}
            />
            ಇನ್ನೂ ಸ್ವೀಕರಿಸಿಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 5 */}
      <FormGroup>
        <QuestionNumber>5</QuestionNumber>
        <Label>ಸೌಲಭ್ಯವನ್ನು ಪಡೆಯುವ ಒಟ್ಟಾರೆ ಪ್ರಕ್ರಿಯೆಯನ್ನು ನೀವು ಹೇಗೆ ಪರಿಗಣಿಸುತ್ತೀರಿ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="overallProcess"
              value="very_easy"
              checked={formData.overallProcess === 'very_easy'}
              onChange={(e) => setFormData({...formData, overallProcess: e.target.value})}
            />
            ಅತಿ ಸುಲಭ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="overallProcess"
              value="easy"
              checked={formData.overallProcess === 'easy'}
              onChange={(e) => setFormData({...formData, overallProcess: e.target.value})}
            />
            ಸುಲಭ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="overallProcess"
              value="moderate"
              checked={formData.overallProcess === 'moderate'}
              onChange={(e) => setFormData({...formData, overallProcess: e.target.value})}
            />
            ಸಾಧಾರಣ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="overallProcess"
              value="difficult"
              checked={formData.overallProcess === 'difficult'}
              onChange={(e) => setFormData({...formData, overallProcess: e.target.value})}
            />
            ಕಠಿಣ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 6 */}
      <FormGroup>
        <QuestionNumber>6</QuestionNumber>
        <Label>ಅಂತರ್ಜಾತಿ ಸಾಮರಸ್ಯವನ್ನು ಉತ್ತೇಜಿಸುವ ಯಾವುದೇ ಜಾಗೃತಿ ಕಾರ್ಯಕ್ರಮಗಳಲ್ಲಿ ನೀವು ಎಂದಾದರೂ ಭಾಗವಹಿಸಿದ್ದೀರಾ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="participatedAwarenessPrograms"
              value="yes"
              checked={formData.participatedAwarenessPrograms === 'yes'}
              onChange={(e) => setFormData({...formData, participatedAwarenessPrograms: e.target.value})}
            />
            ಹೌದು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="participatedAwarenessPrograms"
              value="no"
              checked={formData.participatedAwarenessPrograms === 'no'}
              onChange={(e) => setFormData({...formData, participatedAwarenessPrograms: e.target.value})}
            />
            ಇಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 7 */}
      <FormGroup>
        <QuestionNumber>7</QuestionNumber>
        <Label>ಯಾವುದೇ ಸಾರ್ವಜನಿಕ ಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ನಿಮ್ಮ ವಿವಾಹಕ್ಕೆ ಸಂಬಂಧಿಸಿದಂತೆ ನೀವು ಎದುರಿಸಿರುವ ಸಮಸ್ಯೆಗಳು/ನಿಮ್ಮ ಅನುಭವ/ನಿಮ್ಮ ಯಶೋಗಾಥೆಯ ಬಗ್ಗೆ ಮಾತನಾಡಲು ಅಥವಾ ಹಂಚಿಕೊಳ್ಳಲು ನಿಮ್ಮನ್ನು ಎಂದಾದರೂ ಆಹ್ವಾನಿಸಲಾಗಿದೆಯೇ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="invitedToShare"
              value="yes"
              checked={formData.invitedToShare === 'yes'}
              onChange={(e) => setFormData({...formData, invitedToShare: e.target.value})}
            />
            ಹೌದು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="invitedToShare"
              value="no"
              checked={formData.invitedToShare === 'no'}
              onChange={(e) => setFormData({...formData, invitedToShare: e.target.value})}
            />
            ಇಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {formData.invitedToShare === 'yes' && (
        <FormGroup>
          <Label>ಹೌದು ಎಂದಾದರೆ, ನಿಮ್ಮ ಅನುಭವವನ್ನು ನೀವು ಎಲ್ಲಿ ಹಂಚಿಕೊಂಡಿದ್ದೀರಿ? (ಅನ್ವಯವಾಗುವ ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ)</Label>
          <CheckboxGroup>
            <CheckboxOption>
              <CheckboxInput
                type="checkbox"
                name="sharingVenues"
                value="community_meetings"
                checked={formData.sharingVenues?.includes('community_meetings')}
                onChange={(e) => {
                  const value = e.target.value;
                  const current = formData.sharingVenues || [];
                  if (e.target.checked) {
                    setFormData({...formData, sharingVenues: [...current, value]});
                  } else {
                    setFormData({...formData, sharingVenues: current.filter(item => item !== value)});
                  }
                }}
              />
              ಸಮುದಾಯ ಅಥವಾ ಗ್ರಾಮ ಸಭೆಗಳು
            </CheckboxOption>
            <CheckboxOption>
              <CheckboxInput
                type="checkbox"
                name="sharingVenues"
                value="school_college"
                checked={formData.sharingVenues?.includes('school_college')}
                onChange={(e) => {
                  const value = e.target.value;
                  const current = formData.sharingVenues || [];
                  if (e.target.checked) {
                    setFormData({...formData, sharingVenues: [...current, value]});
                  } else {
                    setFormData({...formData, sharingVenues: current.filter(item => item !== value)});
                  }
                }}
              />
              ಶಾಲಾ ಅಥವಾ ಕಾಲೇಜು ಜಾಗೃತಿ ಕಾರ್ಯಕ್ರಮಗಳು
            </CheckboxOption>
            <CheckboxOption>
              <CheckboxInput
                type="checkbox"
                name="sharingVenues"
                value="ngo_programs"
                checked={formData.sharingVenues?.includes('ngo_programs')}
                onChange={(e) => {
                  const value = e.target.value;
                  const current = formData.sharingVenues || [];
                  if (e.target.checked) {
                    setFormData({...formData, sharingVenues: [...current, value]});
                  } else {
                    setFormData({...formData, sharingVenues: current.filter(item => item !== value)});
                  }
                }}
              />
              ಎನ್.ಜಿ.ಓ. ಆಯೋಜಿತ ಕಾರ್ಯಕ್ರಮಗಳು
            </CheckboxOption>
            <CheckboxOption>
              <CheckboxInput
                type="checkbox"
                name="sharingVenues"
                value="government_programs"
                checked={formData.sharingVenues?.includes('government_programs')}
                onChange={(e) => {
                  const value = e.target.value;
                  const current = formData.sharingVenues || [];
                  if (e.target.checked) {
                    setFormData({...formData, sharingVenues: [...current, value]});
                  } else {
                    setFormData({...formData, sharingVenues: current.filter(item => item !== value)});
                  }
                }}
              />
              ಸರ್ಕಾರಿ ಅಥವಾ ಅಧಿಕೃತ ಕಾರ್ಯಕ್ರಮಗಳು
            </CheckboxOption>
            <CheckboxOption>
              <CheckboxInput
                type="checkbox"
                name="sharingVenues"
                value="media_interviews"
                checked={formData.sharingVenues?.includes('media_interviews')}
                onChange={(e) => {
                  const value = e.target.value;
                  const current = formData.sharingVenues || [];
                  if (e.target.checked) {
                    setFormData({...formData, sharingVenues: [...current, value]});
                  } else {
                    setFormData({...formData, sharingVenues: current.filter(item => item !== value)});
                  }
                }}
              />
              ಮಾಧ್ಯಮ ಸಂದರ್ಶನಗಳು
            </CheckboxOption>
          </CheckboxGroup>
        </FormGroup>
      )}
    </div>
  );

  // Render Section 5 - ಒಟ್ಟಾರೆ ತೃಪ್ತಿ, ಸವಾಲುಗಳು ಮತ್ತು ಶಿಫಾರಸ್ಸುಗಳು
  const renderSection5 = () => (
    <div>
      {/* Question 1 */}
      <FormGroup>
        <QuestionNumber>1</QuestionNumber>
        <Label>ಒಟ್ಟಾರೆಯಾಗಿ, ಈ ಯೋಜನೆ/ಸೌಲಭ್ಯ ನಿಮ್ಮ ಜೀವನದಲ್ಲಿ ಎಷ್ಟು ಯಶಸ್ವಿಯಾಗಿದೆ ಎಂದು ನೀವು ಭಾವಿಸುತ್ತೀರಿ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="schemeSuccess"
              value="very_successful"
              checked={formData.schemeSuccess === 'very_successful'}
              onChange={(e) => setFormData({...formData, schemeSuccess: e.target.value})}
            />
            ಅತ್ಯಂತ ಯಶಸ್ವಿ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="schemeSuccess"
              value="successful"
              checked={formData.schemeSuccess === 'successful'}
              onChange={(e) => setFormData({...formData, schemeSuccess: e.target.value})}
            />
            ಯಶಸ್ವಿ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="schemeSuccess"
              value="moderately_successful"
              checked={formData.schemeSuccess === 'moderately_successful'}
              onChange={(e) => setFormData({...formData, schemeSuccess: e.target.value})}
            />
            ಸಾಧಾರಣವಾಗಿ ಯಶಸ್ವಿ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="schemeSuccess"
              value="less_successful"
              checked={formData.schemeSuccess === 'less_successful'}
              onChange={(e) => setFormData({...formData, schemeSuccess: e.target.value})}
            />
            ಕಡಿಮೆ ಯಶಸ್ವಿ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="schemeSuccess"
              value="not_successful"
              checked={formData.schemeSuccess === 'not_successful'}
              onChange={(e) => setFormData({...formData, schemeSuccess: e.target.value})}
            />
            ಯಶಸ್ವಿಯಾಗಲಿಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 2 */}
      <FormGroup>
        <QuestionNumber>2</QuestionNumber>
        <Label>ಈ ಯೋಜನೆಯನ್ನು ಇತರರಿಗೆ ಶಿಫಾರಸ್ ಮಾಡಲು ನೀವು ಎಷ್ಟು ಸಾಧ್ಯತೆ ಇದೆ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="recommendScheme"
              value="definitely_recommend"
              checked={formData.recommendScheme === 'definitely_recommend'}
              onChange={(e) => setFormData({...formData, recommendScheme: e.target.value})}
            />
            ಖಂಡಿತವಾಗಿ ಶಿಫಾರಸ್ ಮಾಡುತ್ತೇನೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="recommendScheme"
              value="likely_recommend"
              checked={formData.recommendScheme === 'likely_recommend'}
              onChange={(e) => setFormData({...formData, recommendScheme: e.target.value})}
            />
            ಬಹುಶಃ ಶಿಫಾರಸ್ ಮಾಡುತ್ತೇನೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="recommendScheme"
              value="neutral"
              checked={formData.recommendScheme === 'neutral'}
              onChange={(e) => setFormData({...formData, recommendScheme: e.target.value})}
            />
            ತಟಸ್ಥ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="recommendScheme"
              value="unlikely_recommend"
              checked={formData.recommendScheme === 'unlikely_recommend'}
              onChange={(e) => setFormData({...formData, recommendScheme: e.target.value})}
            />
            ಶಿಫಾರಸ್ ಮಾಡುವ ಸಾಧ್ಯತೆ ಕಡಿಮೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="recommendScheme"
              value="definitely_not_recommend"
              checked={formData.recommendScheme === 'definitely_not_recommend'}
              onChange={(e) => setFormData({...formData, recommendScheme: e.target.value})}
            />
            ಖಂಡಿತವಾಗಿ ಶಿಫಾರಸ್ ಮಾಡುವುದಿಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {/* Question 3 */}
      <FormGroup>
        <QuestionNumber>3</QuestionNumber>
        <Label>ಯೋಜನೆಯಲ್ಲಿ ಯಾವ ಸುಧಾರಣೆಗಳನ್ನು ನೀವು ಸೂಚಿಸುತ್ತೀರಿ? (ಅನ್ವಯವಾಗುವ ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ)</Label>
        <CheckboxGroup>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="schemeImprovements"
              value="increase_amount"
              checked={formData.schemeImprovements?.includes('increase_amount')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.schemeImprovements || [];
                if (e.target.checked) {
                  setFormData({...formData, schemeImprovements: [...current, value]});
                } else {
                  setFormData({...formData, schemeImprovements: current.filter(item => item !== value)});
                }
              }}
            />
            ಸಹಾಯ ಮೊತ್ತ ಹೆಚ್ಚಿಸಿ
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="schemeImprovements"
              value="faster_processing"
              checked={formData.schemeImprovements?.includes('faster_processing')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.schemeImprovements || [];
                if (e.target.checked) {
                  setFormData({...formData, schemeImprovements: [...current, value]});
                } else {
                  setFormData({...formData, schemeImprovements: current.filter(item => item !== value)});
                }
              }}
            />
            ವೇಗವಾಗಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುವಿಕೆ
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="schemeImprovements"
              value="better_awareness"
              checked={formData.schemeImprovements?.includes('better_awareness')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.schemeImprovements || [];
                if (e.target.checked) {
                  setFormData({...formData, schemeImprovements: [...current, value]});
                } else {
                  setFormData({...formData, schemeImprovements: current.filter(item => item !== value)});
                }
              }}
            />
            ಉತ್ತಮ ಜಾಗೃತಿ ಕಾರ್ಯಕ್ರಮಗಳು
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="schemeImprovements"
              value="simplified_process"
              checked={formData.schemeImprovements?.includes('simplified_process')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.schemeImprovements || [];
                if (e.target.checked) {
                  setFormData({...formData, schemeImprovements: [...current, value]});
                } else {
                  setFormData({...formData, schemeImprovements: current.filter(item => item !== value)});
                }
              }}
            />
            ಸರಳೀಕೃತ ಅರ್ಜಿ ಪ್ರಕ್ರಿಯೆ
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="schemeImprovements"
              value="better_support"
              checked={formData.schemeImprovements?.includes('better_support')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.schemeImprovements || [];
                if (e.target.checked) {
                  setFormData({...formData, schemeImprovements: [...current, value]});
                } else {
                  setFormData({...formData, schemeImprovements: current.filter(item => item !== value)});
                }
              }}
            />
            ಉತ್ತಮ ಸಿಬ್ಬಂದಿ ಬೆಂಬಲ
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="schemeImprovements"
              value="follow_up_support"
              checked={formData.schemeImprovements?.includes('follow_up_support')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.schemeImprovements || [];
                if (e.target.checked) {
                  setFormData({...formData, schemeImprovements: [...current, value]});
                } else {
                  setFormData({...formData, schemeImprovements: current.filter(item => item !== value)});
                }
              }}
            />
            ಅನುಸರಣಾ ಬೆಂಬಲ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ
          </CheckboxOption>
        </CheckboxGroup>
      </FormGroup>

      {/* Question 4 */}
      <FormGroup>
        <QuestionNumber>4</QuestionNumber>
        <Label>ಭವಿಷ್ಯದಲ್ಲಿ ಯಾವ ರೀತಿಯ ಹೆಚ್ಚುವರಿ ಬೆಂಬಲ ಅಥವಾ ಸೇವೆಗಳು ನಿಮಗೆ ಅಥವಾ ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಸಹಾಯಕವಾಗುತ್ತವೆ? (ಅನ್ವಯವಾಗುವ ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ)</Label>
        <CheckboxGroup>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="futureSupport"
              value="skill_training"
              checked={formData.futureSupport?.includes('skill_training')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.futureSupport || [];
                if (e.target.checked) {
                  setFormData({...formData, futureSupport: [...current, value]});
                } else {
                  setFormData({...formData, futureSupport: current.filter(item => item !== value)});
                }
              }}
            />
            ಕೌಶಲ್ಯ ಮತ್ತು ಉದ್ಯೋಗ ತರಬೇತಿ
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="futureSupport"
              value="education_support"
              checked={formData.futureSupport?.includes('education_support')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.futureSupport || [];
                if (e.target.checked) {
                  setFormData({...formData, futureSupport: [...current, value]});
                } else {
                  setFormData({...formData, futureSupport: current.filter(item => item !== value)});
                }
              }}
            />
            ಮಕ್ಕಳ ಶಿಕ್ಷಣ ಬೆಂಬಲ
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="futureSupport"
              value="healthcare"
              checked={formData.futureSupport?.includes('healthcare')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.futureSupport || [];
                if (e.target.checked) {
                  setFormData({...formData, futureSupport: [...current, value]});
                } else {
                  setFormData({...formData, futureSupport: current.filter(item => item !== value)});
                }
              }}
            />
            ಆರೋಗ್ಯ ಸೇವೆಗಳು
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="futureSupport"
              value="legal_aid"
              checked={formData.futureSupport?.includes('legal_aid')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.futureSupport || [];
                if (e.target.checked) {
                  setFormData({...formData, futureSupport: [...current, value]});
                } else {
                  setFormData({...formData, futureSupport: current.filter(item => item !== value)});
                }
              }}
            />
            ಕಾನೂನು ಸಹಾಯ
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="futureSupport"
              value="counseling"
              checked={formData.futureSupport?.includes('counseling')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.futureSupport || [];
                if (e.target.checked) {
                  setFormData({...formData, futureSupport: [...current, value]});
                } else {
                  setFormData({...formData, futureSupport: current.filter(item => item !== value)});
                }
              }}
            />
            ಮಾನಸಿಕ ಆರೋಗ್ಯ ಮತ್ತು ಸಮಾಲೋಚನೆ ಸೇವೆಗಳು
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="futureSupport"
              value="housing"
              checked={formData.futureSupport?.includes('housing')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.futureSupport || [];
                if (e.target.checked) {
                  setFormData({...formData, futureSupport: [...current, value]});
                } else {
                  setFormData({...formData, futureSupport: current.filter(item => item !== value)});
                }
              }}
            />
            ವಸತಿ ಸಹಾಯ
          </CheckboxOption>
          <CheckboxOption>
            <CheckboxInput
              type="checkbox"
              name="futureSupport"
              value="business_loans"
              checked={formData.futureSupport?.includes('business_loans')}
              onChange={(e) => {
                const value = e.target.value;
                const current = formData.futureSupport || [];
                if (e.target.checked) {
                  setFormData({...formData, futureSupport: [...current, value]});
                } else {
                  setFormData({...formData, futureSupport: current.filter(item => item !== value)});
                }
              }}
            />
            ವ್ಯವಸಾಯ ಸಾಲ ಮತ್ತು ಉದ್ಯಮಶೀಲತೆ ಬೆಂಬಲ
          </CheckboxOption>
        </CheckboxGroup>
      </FormGroup>

      {/* Question 5 */}
      <FormGroup>
        <QuestionNumber>5</QuestionNumber>
        <Label>ಸರ್ಕಾರಕ್ಕೆ ಅಥವಾ ಯೋಜನಾ ನಿರ್ವಾಹಕರಿಗೆ ನಿಮ್ಮ ಸಲಹೆ ಅಥವಾ ಸಂದೇಶ ಏನು? (ಐಚ್ಛಿಕ ಪಠ್ಯ ಉತ್ತರ)</Label>
        <TextArea
          name="governmentMessage"
          value={formData.governmentMessage || ''}
          onChange={(e) => setFormData({...formData, governmentMessage: e.target.value})}
          placeholder="ನಿಮ್ಮ ಸಲಹೆ ಅಥವಾ ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
          rows="4"
        />
      </FormGroup>

      {/* Question 6 */}
      <FormGroup>
        <QuestionNumber>6</QuestionNumber>
        <Label>ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಅಭಿಪ್ರಾಯಗಳು ಅಥವಾ ಸಲಹೆಗಳು? (ಐಚ್ಛಿಕ)</Label>
        <TextArea
          name="additionalComments"
          value={formData.additionalComments || ''}
          onChange={(e) => setFormData({...formData, additionalComments: e.target.value})}
          placeholder="ನಿಮ್ಮ ಹೆಚ್ಚುವರಿ ಅಭಿಪ್ರಾಯಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
          rows="4"
        />
      </FormGroup>

      {/* Question 7 */}
      <FormGroup>
        <QuestionNumber>7</QuestionNumber>
        <Label>ಒಟ್ಟಾರೆಯಾಗಿ, ಈ ಸಮೀಕ್ಷೆಯ ಬಗ್ಗೆ ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ಏನು?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="surveyFeedback"
              value="excellent"
              checked={formData.surveyFeedback === 'excellent'}
              onChange={(e) => setFormData({...formData, surveyFeedback: e.target.value})}
            />
            ಅತ್ಯುತ್ತಮ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="surveyFeedback"
              value="good"
              checked={formData.surveyFeedback === 'good'}
              onChange={(e) => setFormData({...formData, surveyFeedback: e.target.value})}
            />
            ಚೆನ್ನಾಗಿದೆ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="surveyFeedback"
              value="average"
              checked={formData.surveyFeedback === 'average'}
              onChange={(e) => setFormData({...formData, surveyFeedback: e.target.value})}
            />
            ಸಾಧಾರಣ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="surveyFeedback"
              value="poor"
              checked={formData.surveyFeedback === 'poor'}
              onChange={(e) => setFormData({...formData, surveyFeedback: e.target.value})}
            />
            ಕಳಪೆ
          </RadioOption>
        </RadioGroup>
      </FormGroup>
    </div>
  );

  // Render Section 6 - ವಿಶೇಷ ವಿಭಾಗಗಳು
  const renderSection6 = () => (
    <div>
      {/* Section A: Ex-Devadasi children specific questions */}
      <SubSectionTitle>ವಿಭಾಗ A: ಮಾಜಿ ದೇವದಾಸಿ ಮಕ್ಕಳಿಗೆ ವಿಶೇಷ ಪ್ರಶ್ನೆಗಳು</SubSectionTitle>
      
      {/* Question A1 */}
      <FormGroup>
        <QuestionNumber>A1</QuestionNumber>
        <Label>ನಿಮ್ಮ ತಾಯಿ ದೇವದಾಸಿ ಸಂಪ್ರದಾಯದಲ್ಲಿ ಇದ್ದಾರೆಯೇ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="motherDevadasi"
              value="yes"
              checked={formData.motherDevadasi === 'yes'}
              onChange={(e) => setFormData({...formData, motherDevadasi: e.target.value})}
            />
            ಹೌದು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="motherDevadasi"
              value="no"
              checked={formData.motherDevadasi === 'no'}
              onChange={(e) => setFormData({...formData, motherDevadasi: e.target.value})}
            />
            ಇಲ್ಲ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="motherDevadasi"
              value="not_applicable"
              checked={formData.motherDevadasi === 'not_applicable'}
              onChange={(e) => setFormData({...formData, motherDevadasi: e.target.value})}
            />
            ಅನ್ವಯಿಸುವುದಿಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {formData.motherDevadasi === 'yes' && (
        <>
          {/* Question A2 */}
          <FormGroup>
            <QuestionNumber>A2</QuestionNumber>
            <Label>ನಿಮ್ಮ ತಾಯಿಯ ದೇವದಾಸಿ ಹಿನ್ನೆಲೆ ನಿಮ್ಮ ವಿವಾಹದಲ್ಲಿ ಯಾವುದೇ ಸಮಸ್ಯೆಗಳನ್ನು ಉಂಟುಮಾಡಿದೆಯೇ?</Label>
            <RadioGroup>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="devadasiBackgroundIssues"
                  value="major_issues"
                  checked={formData.devadasiBackgroundIssues === 'major_issues'}
                  onChange={(e) => setFormData({...formData, devadasiBackgroundIssues: e.target.value})}
                />
                ಪ್ರಮುಖ ಸಮಸ್ಯೆಗಳು
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="devadasiBackgroundIssues"
                  value="minor_issues"
                  checked={formData.devadasiBackgroundIssues === 'minor_issues'}
                  onChange={(e) => setFormData({...formData, devadasiBackgroundIssues: e.target.value})}
                />
                ಸಣ್ಣ ಸಮಸ್ಯೆಗಳು
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="devadasiBackgroundIssues"
                  value="no_issues"
                  checked={formData.devadasiBackgroundIssues === 'no_issues'}
                  onChange={(e) => setFormData({...formData, devadasiBackgroundIssues: e.target.value})}
                />
                ಯಾವುದೇ ಸಮಸ್ಯೆಗಳಿಲ್ಲ
              </RadioOption>
            </RadioGroup>
          </FormGroup>

          {/* Question A3 */}
          <FormGroup>
            <QuestionNumber>A3</QuestionNumber>
            <Label>ಈ ಯೋಜನೆಯು ದೇವದಾಸಿ ಸಂಪ್ರದಾಯದಿಂದ ಮುಕ್ತಗೊಳಿಸುವಲ್ಲಿ ಎಷ್ಟು ಪರಿಣಾಮಕಾರಿಯಾಗಿದೆ?</Label>
            <RadioGroup>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="schemeEffectivenessDevadasi"
                  value="very_effective"
                  checked={formData.schemeEffectivenessDevadasi === 'very_effective'}
                  onChange={(e) => setFormData({...formData, schemeEffectivenessDevadasi: e.target.value})}
                />
                ಅತ್ಯಂತ ಪರಿಣಾಮಕಾರಿ
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="schemeEffectivenessDevadasi"
                  value="effective"
                  checked={formData.schemeEffectivenessDevadasi === 'effective'}
                  onChange={(e) => setFormData({...formData, schemeEffectivenessDevadasi: e.target.value})}
                />
                ಪರಿಣಾಮಕಾರಿ
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="schemeEffectivenessDevadasi"
                  value="moderately_effective"
                  checked={formData.schemeEffectivenessDevadasi === 'moderately_effective'}
                  onChange={(e) => setFormData({...formData, schemeEffectivenessDevadasi: e.target.value})}
                />
                ಸಾಧಾರಣವಾಗಿ ಪರಿಣಾಮಕಾರಿ
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="schemeEffectivenessDevadasi"
                  value="less_effective"
                  checked={formData.schemeEffectivenessDevadasi === 'less_effective'}
                  onChange={(e) => setFormData({...formData, schemeEffectivenessDevadasi: e.target.value})}
                />
                ಕಡಿಮೆ ಪರಿಣಾಮಕಾರಿ
              </RadioOption>
            </RadioGroup>
          </FormGroup>
        </>
      )}

      {/* Section B: Widow remarriage specific questions */}
      <SubSectionTitle>ವಿಭಾಗ B: ವಿಧವಾ ಮರುವಿವಾಹಕ್ಕೆ ವಿಶೇಷ ಪ್ರಶ್ನೆಗಳು</SubSectionTitle>

      {/* Question B1 */}
      <FormGroup>
        <QuestionNumber>B1</QuestionNumber>
        <Label>ನೀವು ವಿಧವೆಯಾಗಿ ಮರುವಿವಾಹ ಮಾಡಿಕೊಂಡಿದ್ದೀರಾ?</Label>
        <RadioGroup>
          <RadioOption>
            <RadioInput
              type="radio"
              name="widowRemarriage"
              value="yes"
              checked={formData.widowRemarriage === 'yes'}
              onChange={(e) => setFormData({...formData, widowRemarriage: e.target.value})}
            />
            ಹೌದು
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="widowRemarriage"
              value="no"
              checked={formData.widowRemarriage === 'no'}
              onChange={(e) => setFormData({...formData, widowRemarriage: e.target.value})}
            />
            ಇಲ್ಲ
          </RadioOption>
          <RadioOption>
            <RadioInput
              type="radio"
              name="widowRemarriage"
              value="not_applicable"
              checked={formData.widowRemarriage === 'not_applicable'}
              onChange={(e) => setFormData({...formData, widowRemarriage: e.target.value})}
            />
            ಅನ್ವಯಿಸುವುದಿಲ್ಲ
          </RadioOption>
        </RadioGroup>
      </FormGroup>

      {formData.widowRemarriage === 'yes' && (
        <>
          {/* Question B2 */}
          <FormGroup>
            <QuestionNumber>B2</QuestionNumber>
            <Label>ವಿಧವಾ ಮರುವಿವಾಹದ ಸಂದರ್ಭದಲ್ಲಿ ನೀವು ಯಾವ ಸವಾಲುಗಳನ್ನು ಎದುರಿಸಿದ್ದೀರಿ? (ಅನ್ವಯವಾಗುವ ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ)</Label>
            <CheckboxGroup>
              <CheckboxOption>
                <CheckboxInput
                  type="checkbox"
                  name="widowRemarriageChallenges"
                  value="family_opposition"
                  checked={formData.widowRemarriageChallenges?.includes('family_opposition')}
                  onChange={(e) => {
                    const value = e.target.value;
                    const current = formData.widowRemarriageChallenges || [];
                    if (e.target.checked) {
                      setFormData({...formData, widowRemarriageChallenges: [...current, value]});
                    } else {
                      setFormData({...formData, widowRemarriageChallenges: current.filter(item => item !== value)});
                    }
                  }}
                />
                ಕುಟುಂಬ ವಿರೋಧ
              </CheckboxOption>
              <CheckboxOption>
                <CheckboxInput
                  type="checkbox"
                  name="widowRemarriageChallenges"
                  value="social_stigma"
                  checked={formData.widowRemarriageChallenges?.includes('social_stigma')}
                  onChange={(e) => {
                    const value = e.target.value;
                    const current = formData.widowRemarriageChallenges || [];
                    if (e.target.checked) {
                      setFormData({...formData, widowRemarriageChallenges: [...current, value]});
                    } else {
                      setFormData({...formData, widowRemarriageChallenges: current.filter(item => item !== value)});
                    }
                  }}
                />
                ಸಾಮಾಜಿಕ ಕಳಂಕ
              </CheckboxOption>
              <CheckboxOption>
                <CheckboxInput
                  type="checkbox"
                  name="widowRemarriageChallenges"
                  value="financial_issues"
                  checked={formData.widowRemarriageChallenges?.includes('financial_issues')}
                  onChange={(e) => {
                    const value = e.target.value;
                    const current = formData.widowRemarriageChallenges || [];
                    if (e.target.checked) {
                      setFormData({...formData, widowRemarriageChallenges: [...current, value]});
                    } else {
                      setFormData({...formData, widowRemarriageChallenges: current.filter(item => item !== value)});
                    }
                  }}
                />
                ಆರ್ಥಿಕ ಸಮಸ್ಯೆಗಳು
              </CheckboxOption>
              <CheckboxOption>
                <CheckboxInput
                  type="checkbox"
                  name="widowRemarriageChallenges"
                  value="children_from_first_marriage"
                  checked={formData.widowRemarriageChallenges?.includes('children_from_first_marriage')}
                  onChange={(e) => {
                    const value = e.target.value;
                    const current = formData.widowRemarriageChallenges || [];
                    if (e.target.checked) {
                      setFormData({...formData, widowRemarriageChallenges: [...current, value]});
                    } else {
                      setFormData({...formData, widowRemarriageChallenges: current.filter(item => item !== value)});
                    }
                  }}
                />
                ಮೊದಲ ವಿವಾಹದಿಂದ ಮಕ್ಕಳ ಸಮಸ್ಯೆಗಳು
              </CheckboxOption>
            </CheckboxGroup>
          </FormGroup>

          {/* Question B3 */}
          <FormGroup>
            <QuestionNumber>B3</QuestionNumber>
            <Label>ವಿಧವಾ ಮರುವಿವಾಹ ಯೋಜನೆಯು ನಿಮ್ಮ ಜೀವನದಲ್ಲಿ ಎಷ್ಟು ಸಕಾರಾತ್ಮಕ ಪರಿಣಾಮ ಬೀರಿದೆ?</Label>
            <RadioGroup>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="widowSchemeImpact"
                  value="very_positive"
                  checked={formData.widowSchemeImpact === 'very_positive'}
                  onChange={(e) => setFormData({...formData, widowSchemeImpact: e.target.value})}
                />
                ಅತ್ಯಂತ ಸಕಾರಾತ್ಮಕ
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="widowSchemeImpact"
                  value="positive"
                  checked={formData.widowSchemeImpact === 'positive'}
                  onChange={(e) => setFormData({...formData, widowSchemeImpact: e.target.value})}
                />
                ಸಕಾರಾತ್ಮಕ
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="widowSchemeImpact"
                  value="neutral"
                  checked={formData.widowSchemeImpact === 'neutral'}
                  onChange={(e) => setFormData({...formData, widowSchemeImpact: e.target.value})}
                />
                ತಟಸ್ಥ
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  name="widowSchemeImpact"
                  value="minimal_impact"
                  checked={formData.widowSchemeImpact === 'minimal_impact'}
                  onChange={(e) => setFormData({...formData, widowSchemeImpact: e.target.value})}
                />
                ಕಡಿಮೆ ಪರಿಣಾಮ
              </RadioOption>
            </RadioGroup>
          </FormGroup>
        </>
      )}
    </div>
  );

  // Add other render functions for sections 2-6...

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1:
        return renderSection1();
      case 2:
        return renderSection2();
      case 3:
        return renderSection3();
      case 4:
        return renderSection4();
      case 5:
        return renderSection5();
      case 6:
        return renderSection6();
      default:
        return (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#4a5568' }}>
            <h3 style={{ color: '#667eea', marginBottom: '20px' }}>ವಿಭಾಗ {currentSection}</h3>
            <p>ಶೀಘ್ರದಲ್ಲೇ ಕಾರ್ಯಗತಗೊಳಿಸಲಾಗುವುದು...</p>
          </div>
        );
    }
  };

  const progress = (currentSection / SECTIONS.length) * 100;
  const currentSectionData = SECTIONS[currentSection - 1];
  const IconComponent = currentSectionData.icon;

  if (!isLoggedIn) {
    return null;
  }

  return (
    <PageWrapper>
      <EnhancedNavbar />
      <PageContainer>
        <Header>
          <Title>ಕನ್ನಡ ಪ್ರಶ್ನಾವಳಿ</Title>
          <Subtitle>ಸರಕಾರಿ ಯೋಜನೆಗಳ ಪರಿಣಾಮಕಾರಿತ್ವದ ಮೌಲ್ಯಮಾಪನ</Subtitle>
          <TimeEstimate>ಅಂದಾಜು ಸಮಯ: 25-30 ನಿಮಿಷಗಳು</TimeEstimate>
        </Header>

        <ProgressContainer>
          <ProgressHeader>
            <ProgressTitle>{currentSectionData.title}</ProgressTitle>
            <ProgressText>{Math.round(progress)}% ಪೂರ್ಣಗೊಂಡಿದೆ</ProgressText>
          </ProgressHeader>
          <ProgressBarContainer>
            <ProgressBar progress={progress} />
          </ProgressBarContainer>
          <SectionIndicators>
            {SECTIONS.map((section, index) => {
              const SectionIcon = section.icon;
              return (
                <SectionIndicator
                  key={index}
                  active={currentSection === index + 1}
                  completed={completedSections.includes(index + 1)}
                  onClick={() => handleSectionChange(index + 1)}
                >
                  <SectionIcon />
                  <SectionLabel
                    active={currentSection === index + 1}
                  >
                    {section.title}
                  </SectionLabel>
                </SectionIndicator>
              );
            })}
          </SectionIndicators>
        </ProgressContainer>

        <FormContainer>
          <SectionTitle>
            <IconComponent />
            {currentSectionData.title}
          </SectionTitle>
          <SectionDescription>
            {currentSectionData.description}
          </SectionDescription>
          
          {renderCurrentSection()}
        </FormContainer>

        <NavigationContainer>
          <NavButton
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentSection === 1 || loading}
          >
            <FaArrowLeft />
            ಹಿಂದಿನದು
          </NavButton>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {autoSaveStatus && (
              <div style={{ fontSize: '0.8rem', color: '#38a169', fontWeight: '600' }}>
                {autoSaveStatus}
              </div>
            )}
            {lastSavedTime && (
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                ಕೊನೆಯ ಬಾರಿ ಉಳಿಸಿದ್ದು: {lastSavedTime.toLocaleTimeString('kn-IN')}
              </div>
            )}
          </div>

          {currentSection === SECTIONS.length ? (
            <NavButton 
              variant="primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'ಸಲ್ಲಿಸುತ್ತಿದೆ...' : 'ಸಲ್ಲಿಸಿ'}
              <FaCheck />
            </NavButton>
          ) : (
            <NavButton 
              variant="primary" 
              onClick={handleNext}
              disabled={loading}
            >
              ಮುಂದಿನದು
              <FaArrowRight />
            </NavButton>
          )}
        </NavigationContainer>

        {/* Status Messages */}
        {success && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#d1fae5', 
            borderLeft: '4px solid #10b981',
            color: '#047857',
            margin: '20px',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            {success}
          </div>
        )}
        
        {error && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fee2e2', 
            borderLeft: '4px solid #ef4444',
            color: '#dc2626',
            margin: '20px',
            borderRadius: '4px',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}
      </PageContainer>
    </PageWrapper>
  );
}
