// src/QuestionnaireFormPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './components/Navbar'; // Assuming your Navbar is in src/components/Navbar.jsx

// --- Styled Components based on Tailwind CSS classes ---

const PageContainer = styled.div`
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background-color: #f8faff; /* Corresponds to Tailwind bg-gray-50 */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the container horizontally */
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 900px; /* Corresponds to Tailwind max-w-4xl (approx.) */
  width: 100%;
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem; /* px-4 */
  padding-top: 2rem; /* py-8 */
  padding-bottom: 2rem; /* py-8 */
  margin-left: auto;
  margin-right: auto; /* mx-auto */
  box-sizing: border-box; /* Ensures padding is included in width */
`;

const HeaderCard = styled.div`
  background-color: #fff;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
  padding: 1.5rem; /* p-6 */
  margin-bottom: 2rem; /* mb-8 */
`;

const HeaderTitle = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700; /* font-bold */
  color: #166534; /* text-primary-800 from your Tailwind config */
  margin-bottom: 1rem; /* mb-4 */
`;

const HeaderSubtitle = styled.h2`
  font-size: 1.25rem; /* text-xl */
  color: #4a5568; /* text-gray-700 */
  margin-bottom: 0.5rem; /* mb-2 */
`;

const HeaderDescription = styled.p`
  color: #555; /* text-gray-600 */
`;

const ProgressBarCard = styled.div`
  background-color: #fff;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
  padding: 1rem; /* p-4 */
  margin-bottom: 1.5rem; /* mb-6 */
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem; /* mb-2 */
`;

const ProgressText = styled.span`
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #166534; /* text-primary-700 */
`;

const ProgressBarOuter = styled.div`
  width: 100%;
  background-color: #e2e8f0; /* bg-gray-200 */
  border-radius: 9999px; /* rounded-full */
  height: 0.5rem; /* h-2 */
`;

const ProgressBarInner = styled.div`
  background-color: #22c55e; /* bg-primary-500 */
  height: 0.5rem; /* h-2 */
  border-radius: 9999px; /* rounded-full */
  transition: width 300ms ease-in-out; /* transition-all duration-300 */
`;

const QuestionnaireForm = styled.form`
  margin-top: 2rem; /* space-y-8 (approx) */
  > div + div {
    margin-top: 2rem; /* space-y-8 for sections */
  }
`;

const FormSectionCard = styled.div`
  background-color: #fff;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
  padding: 1.5rem; /* p-6 */
`;

const SectionSubheading = styled.h3`
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  color: #166534; /* text-primary-800 */
  margin-bottom: 1.5rem; /* mb-6 */
  border-bottom: 1px solid #bbf7d0; /* border-b border-primary-200 */
  padding-bottom: 0.75rem; /* pb-3 */
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr)); /* grid-cols-1 */
  gap: 1.5rem; /* gap-6 */

  @media (min-width: 768px) { /* md:grid-cols-2 */
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const FormGroup = styled.div`
  /* Standard FormGroup style */
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #4a5568; /* text-gray-700 */
  margin-bottom: 0.5rem; /* mb-2 */
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  box-sizing: border-box; /* Ensures padding is included in width */

  &:focus {
    outline: none; /* focus:outline-none */
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5); /* focus:ring-2 focus:ring-primary-500 */
    border-color: transparent; /* focus:border-transparent */
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: row; /* Default flex-direction is row */
  gap: 1rem; /* space-x-4 */
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;

  input[type="radio"] {
    margin-right: 0.5rem; /* ml-2 */
    color: #16a34a; /* text-primary-600 */
    accent-color: #16a34a; /* For consistent radio button color */
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  box-sizing: border-box;

  &:focus {
    outline: none; /* focus:outline-none */
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5); /* focus:ring-2 focus:ring-primary-500 */
    border-color: transparent; /* focus:border-transparent */
  }
`;

const CheckboxGroup = styled.div`
  display: grid; /* Changed to grid for more flexible wrapping on multi-column */
  grid-template-columns: repeat(2, minmax(0, 1fr)); /* grid-cols-2 */
  gap: 0.5rem; /* gap-2 */

  @media (min-width: 768px) { /* md:grid-cols-3 */
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;

  input[type="checkbox"] {
    margin-right: 0.5rem; /* ml-2 */
    color: #16a34a; /* text-primary-600 */
    accent-color: #16a34a; /* For consistent checkbox color */
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  box-sizing: border-box;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
    border-color: transparent;
  }
`;

// --- Navigation Buttons (Reusing Button component for base styling) ---

const NavButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const NavButton = styled.button`
  padding: 0.5rem 1.5rem; /* px-6 py-2 */
  border-radius: 0.375rem; /* rounded-md */
  transition: all 0.2s ease-in-out; /* transition-colors duration-200 */
  font-weight: 500; /* font-medium */

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(NavButton)`
  background-color: #d1d5db; /* bg-gray-300 */
  color: #4a5568; /* text-gray-700 */

  &:hover:not(:disabled) {
    background-color: #a0aec0; /* hover:bg-gray-400 */
  }
`;

const SaveDraftButton = styled(NavButton)`
  background-color: #bbf7d0; /* bg-primary-100 */
  color: #166534; /* text-primary-700 */
  border: 1px solid #86efac; /* border border-primary-300 */
  margin-right: 1rem; /* space-x-4 (approx) */

  &:hover:not(:disabled) {
    background-color: #86efac; /* hover:bg-primary-200 */
  }
`;

const NextButton = styled(NavButton)`
  background-color: #16a34a; /* bg-primary-600 */
  color: #fff;

  &:hover:not(:disabled) {
    background-color: #15803d; /* hover:bg-primary-700 */
  }
`;

const SubmitFormButton = styled(NavButton)` /* For final submit */
  background-color: #22c55e; /* bg-green-600 */
  color: #fff;

  &:hover:not(:disabled) {
    background-color: #16a34a; /* hover:bg-green-700 */
  }
`;


// --- Main Questionnaire Page Component ---

const QuestionnaireFormPage = () => {
  // State for form fields (Section 1 examples)
  const [name, setName] = useState('');
  const [districtTaluk, setDistrictTaluk] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [education, setEducation] = useState('');
  const [employmentBefore, setEmploymentBefore] = useState('');
  const [occupationBefore, setOccupationBefore] = useState(''); // Conditional
  const [incomeBefore, setIncomeBefore] = useState('');
  const [receivedBenefits, setReceivedBenefits] = useState('');
  const [schemeTypes, setSchemeTypes] = useState([]); // Array for multiple checkboxes
  const [otherBenefits, setOtherBenefits] = useState('');
  const [otherBenefitsSpecify, setOtherBenefitsSpecify] = useState(''); // Conditional
  const [benefitDate, setBenefitDate] = useState('');
  const [casteCategory, setCasteCategory] = useState('');
  const [scSubcaste, setScSubcaste] = useState(''); // Conditional
  const [stIdentity, setStIdentity] = useState([]); // Conditional, array for multiple checkboxes

  // State for multi-section form
  const totalSections = 6;
  const [currentSection, setCurrentSection] = useState(1);

  // State for success message visibility (not directly in this section, but usually after form submission)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // --- useEffect for conditional field visibility (Replicating script.js logic) ---
  useEffect(() => {
    // Logic for 'Occupation before scheme' based on 'employment_before'
    // This is a simplified example. In a real app, you might have specific functions.
    if (employmentBefore === 'yes') {
      // Logic to show occupation field
    } else {
      setOccupationBefore(''); // Clear value if hidden
    }
  }, [employmentBefore]);

  useEffect(() => {
    // Logic for 'scheme-types' based on 'received_benefits'
    if (receivedBenefits === 'yes') {
      // Logic to show scheme types checkboxes
    } else {
      setSchemeTypes([]); // Clear value if hidden
    }
  }, [receivedBenefits]);

  useEffect(() => {
    // Logic for 'other-benefits-specify' based on 'other_benefits'
    if (otherBenefits === 'yes') {
      // Logic to show other benefits specify field
    } else {
      setOtherBenefitsSpecify(''); // Clear value if hidden
    }
  }, [otherBenefits]);

  useEffect(() => {
    // Logic for 'sc-subcaste' and 'st-identity' based on 'caste_category'
    if (casteCategory === 'sc') {
      // Show SC subcaste field
    } else {
      setScSubcaste('');
    }
    if (casteCategory === 'st') {
      // Show ST identity field
    } else {
      setStIdentity([]);
    }
  }, [casteCategory]);


  // --- Navigation Handlers ---
  const handlePrev = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleNext = () => {
    // In a real app, you would add form validation here before moving to the next section
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // Here you would gather all form data from states and send to backend
    console.log('Final Questionnaire Data:', {
      // Section 1 data
      name, districtTaluk, age, gender, education,
      employmentBefore, occupationBefore, incomeBefore,
      receivedBenefits, schemeTypes, otherBenefits, otherBenefitsSpecify,
      benefitDate, casteCategory, scSubcaste, stIdentity,
      // ... (add states for Section 2, 3, 4, 5, 6 here)
    });
    // Simulate successful submission
    setShowSuccessMessage(true);
    // In a real app, you might navigate to a thank you page or reset the form
  };

  return (
    <PageContainer>
      <Navbar /> {/* Place Navbar at the top */}

      <ContentWrapper>
        {/* Header Section */}
        <HeaderCard>
          <HeaderTitle>Questionnaire</HeaderTitle>
          <HeaderSubtitle>
            Impact Evaluation of SCSP/TSP Incentive Schemes for Inter-Caste Marriages and Other Schemes in Karnataka
          </HeaderSubtitle>
          <HeaderDescription>Please fill out all required fields marked with *</HeaderDescription>
        </HeaderCard>

        {/* Progress Bar */}
        <ProgressBarCard>
          <ProgressHeader>
            <ProgressText>Progress</ProgressText>
            <ProgressText>{`Section ${currentSection} of ${totalSections}`}</ProgressText>
          </ProgressHeader>
          <ProgressBarOuter>
            <ProgressBarInner style={{ width: `${(currentSection / totalSections) * 100}%` }}></ProgressBarInner>
          </ProgressBarOuter>
        </ProgressBarCard>

        <QuestionnaireForm onSubmit={handleSubmitForm}>
          {/* Section 1: Respondent Information & Scheme Details */}
          {currentSection === 1 && (
            <FormSectionCard data-section="1">
              <SectionSubheading>Section 1: Respondent Information & Scheme Details</SectionSubheading>

              <GridContainer>
                <FormGroup>
                  <Label htmlFor="name">Name (Optional/Initials)</Label>
                  <Input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="district_taluk">District and Taluk of Residence *</Label>
                  <Input type="text" id="district_taluk" name="district_taluk" value={districtTaluk} onChange={(e) => setDistrictTaluk(e.target.value)} required />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="age">Age (at time of interview) *</Label>
                  <Input type="number" id="age" name="age" value={age} onChange={(e) => setAge(e.target.value)} required min="18" max="100" />
                </FormGroup>

                <FormGroup>
                  <Label>Gender *</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" id="gender_male" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} required />
                      <span>Male</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" id="gender_female" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} required />
                      <span>Female</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" id="gender_other" name="gender" value="other" checked={gender === 'other'} onChange={(e) => setGender(e.target.value)} required />
                      <span>Other</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
              </GridContainer>

              <FormGroup style={{ marginTop: '1.5rem' }}>
                <Label htmlFor="education">Educational Qualification *</Label>
                <Select id="education" name="education" value={education} onChange={(e) => setEducation(e.target.value)} required>
                  <option value="">Select Education Level</option>
                  <option value="no_formal">No formal schooling</option>
                  <option value="below_5th">Below 5th standard</option>
                  <option value="below_8th">Below 8th standard</option>
                  <option value="up_to_12th">Up to 12th standard</option>
                  <option value="graduation">Graduation/Diploma</option>
                  <option value="post_graduation">Post Graduation and above</option>
                </Select>
              </FormGroup>

              <FormGroup style={{ marginTop: '1.5rem' }}>
                <Label>Employment status before receiving scheme benefit *</Label>
                <RadioGroup>
                  <RadioOption>
                    <input type="radio" id="employment_before_yes" name="employment_before" value="yes" checked={employmentBefore === 'yes'} onChange={(e) => setEmploymentBefore(e.target.value)} required />
                    <span>Yes</span>
                  </RadioOption>
                  <RadioOption>
                    <input type="radio" id="employment_before_no" name="employment_before" value="no" checked={employmentBefore === 'no'} onChange={(e) => setEmploymentBefore(e.target.value)} required />
                    <span>No</span>
                  </RadioOption>
                </RadioGroup>
              </FormGroup>

              {employmentBefore === 'yes' && ( /* Conditional rendering for occupation field */
                <FormGroup style={{ marginTop: '1.5rem' }}>
                  <Label htmlFor="occupation_before">Occupation before scheme</Label>
                  <Input type="text" id="occupation_before" name="occupation_before" value={occupationBefore} onChange={(e) => setOccupationBefore(e.target.value)} />
                </FormGroup>
              )}

              <FormGroup style={{ marginTop: '1.5rem' }}>
                <Label htmlFor="income_before">Household Annual Income (Before Scheme) *</Label>
                <Select id="income_before" name="income_before" value={incomeBefore} onChange={(e) => setIncomeBefore(e.target.value)} required>
                  <option value="">Select Income Range</option>
                  <option value="below_50k">Below ₹50,000</option>
                  <option value="50k_1l">₹50,001 – ₹1,00,000</option>
                  <option value="1l_2l">₹1,00,001 – ₹2,00,000</option>
                  <option value="2l_3l">₹2,00,001 – ₹3,00,000</option>
                  <option value="3l_5l">₹3,00,001 – ₹5,00,000</option>
                  <option value="above_5l">Above ₹5,00,000</option>
                  <option value="prefer_not">Prefer not to disclose</option>
                </Select>
              </FormGroup>

              <FormGroup style={{ marginTop: '1.5rem' }}>
                <Label>Have you received benefits from the State for SCSP/TSP schemes in 2020-21 / 2023-24 / 2024-25? *</Label>
                <RadioGroup>
                  <RadioOption>
                    <input type="radio" id="received_benefits_yes" name="received_benefits" value="yes" checked={receivedBenefits === 'yes'} onChange={(e) => setReceivedBenefits(e.target.value)} required />
                    <span>Yes</span>
                  </RadioOption>
                  <RadioOption>
                    <input type="radio" id="received_benefits_no" name="received_benefits" value="no" checked={receivedBenefits === 'no'} onChange={(e) => setReceivedBenefits(e.target.value)} required />
                    <span>No</span>
                  </RadioOption>
                </RadioGroup>
              </FormGroup>

              {receivedBenefits === 'yes' && ( /* Conditional rendering for scheme types */
                <FormGroup style={{ marginTop: '1.5rem' }}>
                  <Label>Please select the applicable scheme(s):</Label>
                  <CheckboxGroup>
                    <CheckboxOption>
                      <input type="checkbox" id="scheme_inter_caste_marriage" name="schemes[]" value="inter_caste_marriage" checked={schemeTypes.includes('inter_caste_marriage')} onChange={(e) => setSchemeTypes(e.target.checked ? [...schemeTypes, e.target.value] : schemeTypes.filter(s => s !== e.target.value))} />
                      <span>Incentives for Inter-Caste Marriage</span>
                    </CheckboxOption>
                    <CheckboxOption>
                      <input type="checkbox" id="scheme_inter_sub_caste" name="schemes[]" value="inter_sub_caste" checked={schemeTypes.includes('inter_sub_caste')} onChange={(e) => setSchemeTypes(e.target.checked ? [...schemeTypes, e.target.value] : schemeTypes.filter(s => s !== e.target.value))} />
                      <span>Incentives for Inter-Sub Caste Marriage</span>
                    </CheckboxOption>
                    <CheckboxOption>
                      <input type="checkbox" id="scheme_widow_remarriage" name="schemes[]" value="widow_remarriage" checked={schemeTypes.includes('widow_remarriage')} onChange={(e) => setSchemeTypes(e.target.checked ? [...schemeTypes, e.target.value] : schemeTypes.filter(s => s !== e.target.value))} />
                      <span>Incentives for Widow Re-marriage</span>
                    </CheckboxOption>
                    <CheckboxOption>
                      <input type="checkbox" id="scheme_mass_marriage" name="schemes[]" value="mass_marriage" checked={schemeTypes.includes('mass_marriage')} onChange={(e) => setSchemeTypes(e.target.checked ? [...schemeTypes, e.target.value] : schemeTypes.filter(s => s !== e.target.value))} />
                      <span>Incentives for Simple Mass Marriage</span>
                    </CheckboxOption>
                    <CheckboxOption>
                      <input type="checkbox" id="scheme_devadasi_children" name="schemes[]" value="devadasi_children" checked={schemeTypes.includes('devadasi_children')} onChange={(e) => setSchemeTypes(e.target.checked ? [...schemeTypes, e.target.value] : schemeTypes.filter(s => s !== e.target.value))} />
                      <span>Incentives for Marriage of Devadasi Children</span>
                    </CheckboxOption>
                    <CheckboxOption style={{ marginTop: '0.5rem' }}>
                      <input type="checkbox" id="scheme_others" name="schemes[]" value="others_scheme" checked={schemeTypes.includes('others_scheme')} onChange={(e) => setSchemeTypes(e.target.checked ? [...schemeTypes, e.target.value] : schemeTypes.filter(s => s !== e.target.value))} />
                      <span>Others:</span>
                    </CheckboxOption>
                    {schemeTypes.includes('others_scheme') && (
                      <Input type="text" name="scheme_others_specify" placeholder="Please specify" style={{ marginTop: '0.25rem' }} />
                    )}
                  </CheckboxGroup>
                </FormGroup>
              )}

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label>Received any other benefits for inter-caste marriage?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" id="other_benefits_yes" name="other_benefits" value="yes" checked={otherBenefits === 'yes'} onChange={(e) => setOtherBenefits(e.target.value)} />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" id="other_benefits_no" name="other_benefits" value="no" checked={otherBenefits === 'no'} onChange={(e) => setOtherBenefits(e.target.value)} />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
                {otherBenefits === 'yes' && ( /* Conditional rendering for other benefits specify */
                  <FormGroup>
                    <Label htmlFor="other_benefits_specify">If yes, specify:</Label>
                    <Input type="text" id="other_benefits_specify" name="other_benefits_specify" value={otherBenefitsSpecify} onChange={(e) => setOtherBenefitsSpecify(e.target.value)} />
                  </FormGroup>
                )}
              </GridContainer>

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label htmlFor="benefit_date">Date of receiving benefit</Label>
                  <Input type="date" id="benefit_date" name="benefit_date" value={benefitDate} onChange={(e) => setBenefitDate(e.target.value)} />
                </FormGroup>

                <FormGroup>
                  <Label>Caste Category *</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" id="caste_sc" name="caste_category" value="sc" checked={casteCategory === 'sc'} onChange={(e) => setCasteCategory(e.target.value)} required />
                      <span>SC</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" id="caste_st" name="caste_category" value="st" checked={casteCategory === 'st'} onChange={(e) => setCasteCategory(e.target.value)} required />
                      <span>ST</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
              </GridContainer>
              
              {casteCategory === 'sc' && ( /* Conditional rendering for SC sub-caste */
                <FormGroup style={{ marginTop: '1.5rem' }}>
                  <Label htmlFor="sc_subcaste">(For SC) Sub-caste:</Label>
                  <Input type="text" id="sc_subcaste" name="sc_subcaste" value={scSubcaste} onChange={(e) => setScSubcaste(e.target.value)} />
                </FormGroup>
              )}

              {casteCategory === 'st' && ( /* Conditional rendering for ST identity */
                <FormGroup style={{ marginTop: '1.5rem' }}>
                  <Label>(For ST) Do you identify as:</Label>
                  <CheckboxGroup>
                    <CheckboxOption>
                      <input type="checkbox" id="st_nomadic" name="st_identity[]" value="nomadic" checked={stIdentity.includes('nomadic')} onChange={(e) => setStIdentity(e.target.checked ? [...stIdentity, e.target.value] : stIdentity.filter(id => id !== e.target.value))} />
                      <span>Nomadic Tribe</span>
                    </CheckboxOption>
                    <CheckboxOption>
                      <input type="checkbox" id="st_semi_nomadic" name="st_identity[]" value="semi_nomadic" checked={stIdentity.includes('semi_nomadic')} onChange={(e) => setStIdentity(e.target.checked ? [...stIdentity, e.target.value] : stIdentity.filter(id => id !== e.target.value))} />
                      <span>Semi-Nomadic Tribe</span>
                    </CheckboxOption>
                    <CheckboxOption>
                      <input type="checkbox" id="st_pvtg" name="st_identity[]" value="pvtg" checked={stIdentity.includes('pvtg')} onChange={(e) => setStIdentity(e.target.checked ? [...stIdentity, e.target.value] : stIdentity.filter(id => id !== e.target.value))} />
                      <span>PVTG</span>
                    </CheckboxOption>
                  </CheckboxGroup>
                </FormGroup>
              )}

              <FormGroup style={{ marginTop: '1.5rem' }}>
                <Label>Utilization of benefit amount (Select all that apply):</Label>
                <CheckboxGroup>
                  <CheckboxOption>
                    <input type="checkbox" id="utilization_housing" name="utilization[]" value="housing" checked={schemeTypes.includes('housing')} onChange={(e) => setSchemeTypes(e.target.checked ? [...schemeTypes, e.target.value] : schemeTypes.filter(u => u !== e.target.value))} />
                    <span>Housing</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" id="utilization_business" name="utilization[]" value="business" checked={schemeTypes.includes('business')} onChange={(e) => setSchemeTypes(e.target.checked ? [...schemeTypes, e.target.value] : schemeTypes.filter(u => u !== e.target.value))} />
                    <span>Business</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" id="utilization_education" name="utilization[]" value="education" checked={schemeTypes.includes('education')} onChange={(e) => setSchemeTypes(e.target.checked ? [...schemeTypes, e.target.value] : schemeTypes.filter(u => u !== e.target.value))} />
                    <span>Education</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" id="utilization_medical" name="utilization[]" value="medical" checked={schemeTypes.includes('medical')} onChange={(e) => setSchemeTypes(e.target.checked ? [...schemeTypes, e.target.value] : schemeTypes.filter(u => u !== e.target.value))} />
                    <span>Medical</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" id="utilization_daily_needs" name="utilization[]" value="daily_needs" checked={schemeTypes.includes('daily_needs')} onChange={(e) => setSchemeTypes(e.target.checked ? [...schemeTypes, e.target.value] : schemeTypes.filter(u => u !== e.target.value))} />
                    <span>Daily Needs</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" id="utilization_savings" name="utilization[]" value="savings" checked={schemeTypes.includes('savings')} onChange={(e) => setSchemeTypes(e.target.checked ? [...schemeTypes, e.target.value] : schemeTypes.filter(u => u !== e.target.value))} />
                    <span>Savings (FD)</span>
                  </CheckboxOption>
                  {/* Assuming 'others' for utilization can also be handled by an 'others_utilization' state */}
                  <CheckboxOption style={{ marginTop: '0.5rem' }}>
                    <input type="checkbox" id="utilization_others" name="utilization[]" value="others_utilization" />
                    <span>Others:</span>
                  </CheckboxOption>
                  {schemeTypes.includes('others_utilization') && (
                      <Input type="text" name="utilization_others_specify" placeholder="Please specify" style={{ marginTop: '0.25rem' }} />
                  )}
                </CheckboxGroup>
              </FormGroup>

            </FormSectionCard>
          )}

          {/* Section 2: Socio-Economic & Livelihood Impact */}
          {currentSection === 2 && (
            <FormSectionCard data-section="2">
              <SectionSubheading>Section 2: Socio-Economic & Livelihood Impact</SectionSubheading>
              <GridContainer>
                <FormGroup>
                  <Label htmlFor="occupation_after">Primary Occupation after receiving scheme benefit</Label>
                  <Input type="text" id="occupation_after" name="occupation_after" /* Add state and onChange */ />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="income_current">Household Annual Income (Current)</Label>
                  <Select id="income_current" name="income_current" /* Add state and onChange */>
                    <option value="">Select Income Range</option>
                    <option value="below_50k">Below ₹50,000</option>
                    <option value="50k_1l">₹50,001 – ₹1,00,000</option>
                    <option value="1l_2l">₹1,00,001 – ₹2,00,000</option>
                    <option value="2l_3l">₹2,00,001 – ₹3,00,000</option>
                    <option value="3l_5l">₹3,00,001 – ₹5,00,000</option>
                    <option value="above_5l">Above ₹5,00,000</option>
                    <option value="prefer_not">Prefer not to disclose</option>
                  </Select>
                </FormGroup>
              </GridContainer>

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label htmlFor="status_before">Socio-Economic Status before benefit</Label>
                  <Select id="status_before" name="status_before" /* Add state and onChange */>
                    <option value="">Select Status</option>
                    <option value="very_poor">Very Poor</option>
                    <option value="poor">Poor</option>
                    <option value="middle_class">Middle Class</option>
                    <option value="upper_middle">Upper Middle Class</option>
                    <option value="well_off">Well-off</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="status_after">Socio-Economic Status after benefit</Label>
                  <Select id="status_after" name="status_after" /* Add state and onChange */>
                    <option value="">Select Status</option>
                    <option value="very_poor">Very Poor</option>
                    <option value="poor">Poor</option>
                    <option value="middle_class">Middle Class</option>
                    <option value="upper_middle">Upper Middle Class</option>
                    <option value="well_off">Well-off</option>
                  </Select>
                </FormGroup>
              </GridContainer>

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label htmlFor="financial_security">Financial security post-benefit (1–5 scale)</Label>
                  <Select id="financial_security" name="financial_security" /* Add state and onChange */>
                    <option value="">Select Rating</option>
                    <option value="1">1 - Very Poor</option>
                    <option value="2">2 - Poor</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Spouse employment post-benefit</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="spouse_employment" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="spouse_employment" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
              </GridContainer>

              <FormGroup style={{ marginTop: '1.5rem' }}>
                <Label htmlFor="social_impact">Impact on social life</Label>
                <Select id="social_impact" name="social_impact" /* Add state and onChange */>
                  <option value="">Select Impact</option>
                  <option value="significantly_improved">Significantly Improved</option>
                  <option value="moderately_improved">Moderately Improved</option>
                  <option value="slightly_improved">Slightly Improved</option>
                  <option value="no_change">No Change</option>
                  <option value="worsened">Worsened</option>
                  <option value="dont_know">Don't Know / NA</option>
                </Select>
              </FormGroup>

              <FormGroup style={{ marginTop: '1.5rem' }}>
                <Label>Who decided how to use the scheme funds?</Label>
                <RadioGroup>
                  <RadioOption>
                    <input type="radio" name="fund_decision" value="self" /* Add state and onChange */ />
                    <span>Self</span>
                  </RadioOption>
                  <RadioOption>
                    <input type="radio" name="fund_decision" value="spouse" /* Add state and onChange */ />
                    <span>Spouse</span>
                  </RadioOption>
                  <RadioOption>
                    <input type="radio" name="fund_decision" value="jointly" /* Add state and onChange */ />
                    <span>Jointly</span>
                  </RadioOption>
                  <RadioOption>
                    <input type="radio" name="fund_decision" value="family" /* Add state and onChange */ />
                    <span>Parents/Family</span>
                  </RadioOption>
                </RadioGroup>
              </FormGroup>

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label>Has your financial dependency reduced post-benefit?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="dependency_reduced" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="dependency_reduced" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Have you started any new livelihood activity using the benefit?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="new_livelihood" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="new_livelihood" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
              </GridContainer>
            </FormSectionCard>
          )}

          {/* Section 3: Social Inclusion & Security */}
          {currentSection === 3 && (
            <FormSectionCard data-section="3">
              <SectionSubheading>Section 3: Social Inclusion & Security</SectionSubheading>

              <GridContainer>
                <FormGroup>
                  <Label htmlFor="mindset_change">Scheme brought progressive change in public mindset? (0 to 5 scale)</Label>
                  <Select id="mindset_change" name="mindset_change" /* Add state and onChange */>
                    <option value="">Select Rating</option>
                    <option value="0">0 - No Change</option>
                    <option value="1">1 - Very Little</option>
                    <option value="2">2 - Little</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - Significant</option>
                    <option value="5">5 - Very Significant</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Felt socially accepted post-incentive?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="socially_accepted" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="socially_accepted" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
              </GridContainer>

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label>Reduction in discrimination faced?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="discrimination_reduction" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="discrimination_reduction" value="some_extent" /* Add state and onChange */ />
                      <span>To Some Extent</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="discrimination_reduction" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Felt more secure (socially/financially)?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="security_feeling" value="yes_significantly" /* Add state and onChange */ />
                      <span>Yes, Significantly</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="security_feeling" value="yes_somewhat" /* Add state and onChange */ />
                      <span>Yes, Somewhat</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="security_feeling" value="no" /* Add state and onChange */ />
                      <span>No, Not at all</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="security_feeling" value="unsure" /* Add state and onChange */ />
                      <span>Unsure/NA</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
              </GridContainer>

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label>Living with in-laws?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="living_with_inlaws" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="living_with_inlaws" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Discrimination from in-laws?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="inlaw_discrimination" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="inlaw_discrimination" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
              </GridContainer>

              {/* Conditional rendering for discrimination explain */}
              {/* Assuming inlaw_discrimination === 'yes' makes this visible */}
              {/* You will need state for inlaw_discrimination and check it here */}
              {false && ( /* Replace 'false' with state check */
                <FormGroup style={{ marginTop: '1.5rem' }}>
                  <Label htmlFor="discrimination_explain">If yes, explain:</Label>
                  <TextArea id="discrimination_explain" name="discrimination_explain" rows="3" /* Add state and onChange */></TextArea>
                </FormGroup>
              )}

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label>Did you file a police complaint?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="police_complaint" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="police_complaint" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Did any NGOs, government officials or local leaders support you during or after your marriage?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="external_support" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="external_support" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
              </GridContainer>
            </FormSectionCard>
          )}

          {/* Section 4: Awareness, Access & Quality of Service */}
          {currentSection === 4 && (
            <FormSectionCard data-section="4">
              <SectionSubheading>Section 4: Awareness, Access & Quality of Service</SectionSubheading>
              <FormGroup style={{ marginTop: '1.5rem' }}>
                <Label>Source of scheme awareness:</Label>
                <CheckboxGroup>
                  <CheckboxOption>
                    <input type="checkbox" name="awareness_source[]" value="government_official" /* Add state and onChange */ />
                    <span>Government Official</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="awareness_source[]" value="panchayat_ward" /* Add state and onChange */ />
                    <span>Panchayat/Ward Member</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="awareness_source[]" value="community_leader" /* Add state and onChange */ />
                    <span>Community Leader</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="awareness_source[]" value="friends_family" /* Add state and onChange */ />
                    <span>Friends/Family</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="awareness_source[]" value="media" /* Add state and onChange */ />
                    <span>Media (TV/Radio/Newspaper)</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="awareness_source[]" value="social_media" /* Add state and onChange */ />
                    <span>Social Media</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="awareness_source[]" value="online_app" /* Add state and onChange */ />
                    <span>Online App</span>
                  </CheckboxOption>
                  <CheckboxOption style={{ marginTop: '0.5rem' }}>
                    <input type="checkbox" name="awareness_source[]" value="others_source" /* Add state and onChange for others checkbox */ />
                    <span>Others:</span>
                  </CheckboxOption>
                  {/* Conditional rendering for other awareness source specify */}
                  {false && ( /* Replace 'false' with state check for others_source checkbox */
                    <Input type="text" name="awareness_others" placeholder="Please specify" style={{ marginTop: '0.25rem' }} />
                  )}
                </CheckboxGroup>
              </FormGroup>

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label>Were officials supportive?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="officials_supportive" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="officials_supportive" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="application_difficulty">Application process difficulty:</Label>
                  <Select id="application_difficulty" name="application_difficulty" /* Add state and onChange */>
                    <option value="">Select Difficulty Level</option>
                    <option value="very_easy">Very Easy</option>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="difficult">Difficult</option>
                    <option value="very_difficult">Very Difficult</option>
                  </Select>
                </FormGroup>
              </GridContainer>

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label htmlFor="time_to_receive">Time taken to receive benefit:</Label>
                  <Input type="text" id="time_to_receive" name="time_to_receive" placeholder="e.g., 3 months" /* Add state and onChange */ />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="disbursement_effectiveness">Effectiveness of fund disbursement process:</Label>
                  <Select id="disbursement_effectiveness" name="disbursement_effectiveness" /* Add state and onChange */>
                    <option value="">Select Effectiveness</option>
                    <option value="very_effective">Very Effective</option>
                    <option value="effective">Effective</option>
                    <option value="moderately_effective">Moderately Effective</option>
                    <option value="not_effective">Not Effective</option>
                    <option value="dont_know">Don't Know / NA</option>
                  </Select>
                </FormGroup>
              </GridContainer>

              <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8faff', borderRadius: '0.5rem' }}> {/* bg-gray-50 p-4 rounded-lg */}
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}> (For Non-Beneficiaries)</h4> {/* text-lg font-semibold text-gray-800 mb-4 */}

                <GridContainer>
                  <FormGroup>
                    <Label>Were you aware of scheme details?</Label>
                    <RadioGroup>
                      <RadioOption>
                        <input type="radio" name="scheme_awareness" value="yes" /* Add state and onChange */ />
                        <span>Yes</span>
                      </RadioOption>
                      <RadioOption>
                        <input type="radio" name="scheme_awareness" value="no" /* Add state and onChange */ />
                        <span>No</span>
                      </RadioOption>
                    </RadioGroup>
                  </FormGroup>

                  <FormGroup>
                    <Label>Application Status:</Label>
                    <RadioGroup>
                      <RadioOption>
                        <input type="radio" name="application_status" value="rejected" /* Add state and onChange */ />
                        <span>Rejected</span>
                      </RadioOption>
                      <RadioOption>
                        <input type="radio" name="application_status" value="pending" /* Add state and onChange */ />
                        <span>Pending</span>
                      </RadioOption>
                    </RadioGroup>
                  </FormGroup>
                </GridContainer>

                <GridContainer style={{ marginTop: '1rem' }}> {/* mt-4 */}
                  {/* Conditional rendering for pending duration */}
                  {false && ( /* Replace 'false' with state check for application_status === 'pending' */
                    <FormGroup>
                      <Label htmlFor="pending_duration">If Pending, duration:</Label>
                      <Input type="text" id="pending_duration" name="pending_duration" placeholder="e.g., 3 months" /* Add state and onChange */ />
                    </FormGroup>
                  )}

                  {/* Conditional rendering for rejection communicated */}
                  {false && ( /* Replace 'false' with state check for application_status === 'rejected' */
                    <FormGroup>
                      <Label>If Rejected, were reasons communicated?</Label>
                      <RadioGroup>
                        <RadioOption>
                          <input type="radio" name="rejection_communicated" value="yes" /* Add state and onChange */ />
                          <span>Yes</span>
                        </RadioOption>
                        <RadioOption>
                          <input type="radio" name="rejection_communicated" value="no" /* Add state and onChange */ />
                          <span>No</span>
                        </RadioOption>
                      </RadioGroup>
                    </FormGroup>
                  )}
                </GridContainer>

                {/* Conditional rendering for rejection reasons */}
                {false && ( /* Replace 'false' with state check for rejection_communicated === 'yes' */
                  <FormGroup style={{ marginTop: '1rem' }}> {/* mt-4 */}
                    <Label htmlFor="rejection_reasons">If Yes, specify reasons:</Label>
                    <TextArea id="rejection_reasons" name="rejection_reasons" rows="3" /* Add state and onChange */></TextArea>
                  </FormGroup>
                )}

                <FormGroup style={{ marginTop: '1rem' }}> {/* mt-4 */}
                  <Label htmlFor="information_quality">Quality of information from officials:</Label>
                  <Select id="information_quality" name="information_quality" /* Add state and onChange */>
                    <option value="">Select Quality</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                    <option value="very_poor">Very Poor</option>
                  </Select>
                </FormGroup>
              </div>
            </FormSectionCard>
          )}

          {/* Section 5: Overall Satisfaction, Challenges & Recommendations */}
          {currentSection === 5 && (
            <FormSectionCard data-section="5">
              <SectionSubheading>Section 5: Overall Satisfaction, Challenges & Recommendations</SectionSubheading>

              <GridContainer>
                <FormGroup>
                  <Label htmlFor="discrimination_success">Scheme success in reducing caste discrimination:</Label>
                  <Select id="discrimination_success" name="discrimination_success" /* Add state and onChange */>
                    <option value="">Select Success Level</option>
                    <option value="very_successful">Very Successful</option>
                    <option value="successful">Successful</option>
                    <option value="moderately_successful">Moderately Successful</option>
                    <option value="not_successful">Not Successful</option>
                    <option value="unsure">Unsure</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="security_success">Scheme success in ensuring security:</Label>
                  <Select id="security_success" name="security_success" /* Add state and onChange */>
                    <option value="">Select Success Level</option>
                    <option value="very_successful">Very Successful</option>
                    <option value="successful">Successful</option>
                    <option value="moderately_successful">Moderately Successful</option>
                    <option value="not_successful">Not Successful</option>
                    <option value="unsure">Unsure</option>
                  </Select>
                </FormGroup>
              </GridContainer>

              <FormGroup style={{ marginTop: '1.5rem' }}>
                <Label>Areas for improvement:</Label>
                <CheckboxGroup>
                  <CheckboxOption>
                    <input type="checkbox" name="improvement_areas[]" value="awareness" /* Add state and onChange */ />
                    <span>Awareness</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="improvement_areas[]" value="documentation" /* Add state and onChange */ />
                    <span>Documentation</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="improvement_areas[]" value="fund_disbursal" /* Add state and onChange */ />
                    <span>Fund Disbursal</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="improvement_areas[]" value="monitoring" /* Add state and onChange */ />
                    <span>Monitoring</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="improvement_areas[]" value="beneficiary_followup" /* Add state and onChange */ />
                    <span>Beneficiary Follow-Up</span>
                  </CheckboxOption>
                  <CheckboxOption style={{ marginTop: '0.5rem' }}>
                    <input type="checkbox" name="improvement_areas[]" value="others_improvement" /* Add state and onChange for others checkbox */ />
                    <span>Others:</span>
                  </CheckboxOption>
                  {/* Conditional rendering for other improvement specify */}
                  {false && ( /* Replace 'false' with state check for others_improvement checkbox */
                    <Input type="text" name="improvement_others" placeholder="Please specify" style={{ marginTop: '0.25rem' }} />
                  )}
                </CheckboxGroup>
              </FormGroup>

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label>Should incentive amount be revised?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="amount_revision" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="amount_revision" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Should the scheme be continued?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="scheme_continuation" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="scheme_continuation" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="scheme_continuation" value="unsure" /* Add state and onChange */ />
                      <span>Unsure</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
              </GridContainer>

              <FormGroup style={{ marginTop: '1.5rem' }}>
                <Label>Experienced Benefits (Select all that apply):</Label>
                <CheckboxGroup>
                  <CheckboxOption>
                    <input type="checkbox" name="experienced_benefits[]" value="financial_support" /* Add state and onChange */ />
                    <span>Financial Support</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="experienced_benefits[]" value="specific_asset" /* Add state and onChange */ />
                    <span>Specific Asset</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="experienced_benefits[]" value="improved_social_standing" /* Add state and onChange */ />
                    <span>Improved Social Standing</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="experienced_benefits[]" value="recognition" /* Add state and onChange */ />
                    <span>Recognition</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="experienced_benefits[]" value="reduced_discrimination" /* Add state and onChange */ />
                    <span>Reduced Discrimination</span>
                  </CheckboxOption>
                  <CheckboxOption>
                    <input type="checkbox" name="experienced_benefits[]" value="mental_wellbeing" /* Add state and onChange */ />
                    <span>Mental Well-being</span>
                  </CheckboxOption>
                </CheckboxGroup>
              </FormGroup>

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label>Would you encourage your children to marry intercaste?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="encourage_intercaste" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="encourage_intercaste" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="encourage_intercaste" value="not_sure" /* Add state and onChange */ />
                      <span>Not sure</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Do you believe this scheme helped reduce caste discrimination in your area?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="area_discrimination_reduction" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="area_discrimination_reduction" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
              </GridContainer>
            </FormSectionCard>
          )}

          {/* Section 6: Questions Specific to Devadasi Children */}
          {currentSection === 6 && (
            <FormSectionCard data-section="6">
              <SectionSubheading>Section 6: Questions Specific to Devadasi Children</SectionSubheading>

              <GridContainer>
                <FormGroup>
                  <Label htmlFor="devadasi_age_marriage">Age of Devadasi child at time of marriage:</Label>
                  <Input type="number" id="devadasi_age_marriage" name="devadasi_age_marriage" min="18" max="50" /* Add state and onChange */ />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="spouse_caste">Caste of spouse:</Label>
                  <Input type="text" id="spouse_caste" name="spouse_caste" /* Add state and onChange */ />
                </FormGroup>
              </GridContainer>

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label>Did the scheme improve dignity of the family?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="dignity_improved" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="dignity_improved" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label>Do you now own property?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="own_property" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="own_property" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
              </GridContainer>

              <GridContainer style={{ marginTop: '1.5rem' }}>
                <FormGroup>
                  <Label htmlFor="inlaw_acceptability">Acceptability in in-laws family (scale 1–5):</Label>
                  <Select id="inlaw_acceptability" name="inlaw_acceptability" /* Add state and onChange */>
                    <option value="">Select Rating</option>
                    <option value="1">1 - Very Poor</option>
                    <option value="2">2 - Poor</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Have you faced stigma as a child of a Devadasi post-marriage?</Label>
                  <RadioGroup>
                    <RadioOption>
                      <input type="radio" name="devadasi_stigma" value="yes" /* Add state and onChange */ />
                      <span>Yes</span>
                    </RadioOption>
                    <RadioOption>
                      <input type="radio" name="devadasi_stigma" value="no" /* Add state and onChange */ />
                      <span>No</span>
                    </RadioOption>
                  </RadioGroup>
                </FormGroup>
              </GridContainer>

              <FormGroup style={{ marginTop: '1.5rem' }}>
                <Label htmlFor="treatment_difference">Any perceived difference in treatment vs. other marriages:</Label>
                <TextArea id="treatment_difference" name="treatment_difference" rows="3" /* Add state and onChange */></TextArea>
              </FormGroup>
            </FormSectionCard>
          )}

          {/* Navigation Buttons */}
          <NavButtonsContainer>
            <PrevButton type="button" onClick={handlePrev} disabled={currentSection === 1}>
              Previous
            </PrevButton>

            <div style={{ display: 'flex', gap: '1rem' }}> {/* flex space-x-4 */}
              <SaveDraftButton type="button">
                Save Draft
              </SaveDraftButton>
              {currentSection < totalSections ? (
                <NextButton type="button" onClick={handleNext}>
                  Next
                </NextButton>
              ) : (
                <SubmitFormButton type="submit">
                  Submit Questionnaire
                </SubmitFormButton>
              )}
            </div>
          </NavButtonsContainer>
        </QuestionnaireForm>

        {/* Success Message */}
        {showSuccessMessage && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '1.5rem', marginTop: '1.5rem' }}> {/* bg-green-50 border border-green-200 rounded-lg p-6 mt-6 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flexShrink: 0 }}>
                <svg style={{ height: '1.25rem', width: '1.25rem', color: '#86efac' }} viewBox="0 0 20 20" fill="currentColor"> {/* h-5 w-5 text-green-400 */}
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div style={{ marginLeft: '0.75rem' }}> {/* ml-3 */}
                <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#166534' }}>Questionnaire Submitted Successfully!</h3> {/* text-sm font-medium text-green-800 */}
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#16a34a' }}>Thank you for your participation. Your responses have been recorded.</p> {/* mt-1 text-sm text-green-700 */}
              </div>
            </div>
          </div>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default QuestionnaireFormPage;