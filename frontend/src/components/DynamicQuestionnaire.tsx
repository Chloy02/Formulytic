"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { usePageTranslation } from '@/hooks/usePageTranslation';

interface QuestionOption {
  value: string;
  label: string;
}

interface QuestionData {
  id: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'date';
  label: string;
  placeholder?: string;
  options?: QuestionOption[];
  required?: boolean;
  section?: string;
  subsection?: string;
}

interface SectionData {
  id: string;
  title: string;
  description?: string;
  questions: QuestionData[];
}

interface QuestionnaireData {
  id: string;
  title: string;
  description?: string;
  sections: SectionData[];
}

interface FormData {
  [key: string]: string | string[] | number | boolean | null | undefined;
}

interface DynamicQuestionnaireProps {
  questionnaire: QuestionnaireData;
  onDataChange?: (data: FormData) => void;
  initialData?: FormData;
  enableTranslation?: boolean;
}

const QuestionnaireContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
`;

const SectionDescription = styled.p`
  color: #718096;
  margin: 0 0 20px 0;
  font-size: 0.95rem;
`;

const QuestionGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 20px;
  color: #718096;
`;

export default function DynamicQuestionnaire({ 
  questionnaire: originalQuestionnaire, 
  onDataChange, 
  initialData = {},
  enableTranslation = true 
}: DynamicQuestionnaireProps) {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [translatedQuestionnaire, setTranslatedQuestionnaire] = useState<QuestionnaireData | null>(null);
  
  const { 
    language, 
    isTranslating, 
    translateQuestionnaire,
    getTranslation 
  } = usePageTranslation({
    enableBulkTranslation: enableTranslation,
    autoTranslateOnLanguageChange: true
  });

  // Translate questionnaire when language changes
  useEffect(() => {
    if (enableTranslation) {
      translateQuestionnaire(originalQuestionnaire as unknown as Record<string, unknown>, language)
        .then((result: any) => setTranslatedQuestionnaire(result as unknown as QuestionnaireData))
        .catch((error: any) => {
          console.error('Failed to translate questionnaire:', error);
          setTranslatedQuestionnaire(originalQuestionnaire);
        });
    } else {
      setTranslatedQuestionnaire(originalQuestionnaire);
    }
  }, [originalQuestionnaire, language, enableTranslation, translateQuestionnaire]);

  const questionnaire = translatedQuestionnaire || originalQuestionnaire;

  const handleInputChange = (questionId: string, value: string | string[] | number | boolean) => {
    const newData = { ...formData, [questionId]: value };
    setFormData(newData);
    onDataChange?.(newData);
  };

  const handleCheckboxChange = (questionId: string, optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(formData[questionId]) ? formData[questionId] as string[] : [];
    let newValues;
    
    if (checked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter((v: string) => v !== optionValue);
    }
    
    handleInputChange(questionId, newValues);
  };

  const renderQuestion = (question: QuestionData) => {
    const value = formData[question.id] || '';

    switch (question.type) {
      case 'text':
      case 'number':
        return (
          <Input
            type={question.type}
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
          />
        );

      case 'textarea':
        return (
          <TextArea
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            required={question.required}
          />
        );

      case 'select':
        return (
          <Select
            value={typeof value === 'string' || typeof value === 'number' ? value : ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            required={question.required}
          >
            <option value="">{question.placeholder || 'Select an option'}</option>
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup>
            {question.options?.map((option) => (
              <RadioItem key={option.value}>
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  required={question.required}
                />
                <span>{option.label}</span>
              </RadioItem>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <CheckboxGroup>
            {question.options?.map((option) => (
              <CheckboxItem key={option.value}>
                <input
                  type="checkbox"
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => handleCheckboxChange(question.id, option.value, e.target.checked)}
                />
                <span>{option.label}</span>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        );

      default:
        return null;
    }
  };

  if (isTranslating && enableTranslation) {
    return (
      <QuestionnaireContainer>
        <LoadingIndicator>Translating questionnaire...</LoadingIndicator>
      </QuestionnaireContainer>
    );
  }

  return (
    <QuestionnaireContainer>
      <h2>{questionnaire.title}</h2>
      {questionnaire.description && <p>{questionnaire.description}</p>}
      
      {questionnaire.sections.map((section) => (
        <SectionCard key={section.id}>
          <SectionTitle>{section.title}</SectionTitle>
          {section.description && (
            <SectionDescription>{section.description}</SectionDescription>
          )}
          
          {section.questions.map((question) => (
            <QuestionGroup key={question.id}>
              <Label>
                {question.label}
                {question.required && <span style={{ color: 'red' }}> *</span>}
              </Label>
              {renderQuestion(question)}
            </QuestionGroup>
          ))}
        </SectionCard>
      ))}
    </QuestionnaireContainer>
  );
}
