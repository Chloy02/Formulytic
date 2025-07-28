// Utility functions for handling bilingual questionnaire data

export interface BilingualText {
  en: string;
  kn: string;
}

export interface QuestionOption {
  id: string;
  value: string;
  label: BilingualText;
  order: number;
}

export interface Question {
  id: string;
  text: BilingualText;
  type: 'text' | 'radio' | 'select' | 'checkbox' | 'textarea';
  options?: QuestionOption[];
  required: boolean;
  section_id: string;
  order: number;
}

export interface Section {
  id: string;
  title: BilingualText;
  description?: BilingualText;
  order: number;
  questions: Question[];
}

export interface Questionnaire {
  id: string;
  title: BilingualText;
  description?: BilingualText;
  sections: Section[];
}

// Helper function to get localized text based on current language
export const getLocalizedText = (
  text: BilingualText, 
  language: 'en' | 'kn'
): string => {
  return text[language] || text.en; // Fallback to English if translation missing
};

// Helper function to get localized question data
export const getLocalizedQuestion = (
  question: Question, 
  language: 'en' | 'kn'
) => ({
  ...question,
  text: getLocalizedText(question.text, language),
  options: question.options?.map(option => ({
    ...option,
    label: getLocalizedText(option.label, language)
  }))
});

// Sample data structure for how it should be stored/retrieved from database
export const sampleQuestionnaireData: Questionnaire = {
  id: "scsp-tsp-evaluation",
  title: {
    en: "SCSP/TSP Impact Evaluation Questionnaire",
    kn: "SCSP/TSP ಪ್ರಭಾವ ಮೌಲ್ಯಮಾಪನ ಪ್ರಶ್ನಾವಳಿ"
  },
  description: {
    en: "Your responses will help us improve these important social programs",
    kn: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗಳು ಈ ಪ್ರಮುಖ ಸಾಮಾಜಿಕ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಸುಧಾರಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತವೆ"
  },
  sections: [
    {
      id: "section1",
      title: {
        en: "Section 1: Basic Information & Demographics",
        kn: "ವಿಭಾಗ 1: ಮೂಲಭೂತ ಮಾಹಿತಿ ಮತ್ತು ಜನಸಂಖ್ಯಾಶಾಸ್ತ್ರ"
      },
      order: 1,
      questions: [
        {
          id: "fullname",
          text: {
            en: "Full Name",
            kn: "ಪೂರ್ಣ ಹೆಸರು"
          },
          type: "text",
          required: true,
          section_id: "section1",
          order: 1
        },
        {
          id: "age",
          text: {
            en: "Age",
            kn: "ವಯಸ್ಸು"
          },
          type: "text",
          required: true,
          section_id: "section1",
          order: 2
        },
        {
          id: "gender",
          text: {
            en: "Gender",
            kn: "ಲಿಂಗ"
          },
          type: "radio",
          required: true,
          section_id: "section1",
          order: 3,
          options: [
            {
              id: "gender_male",
              value: "male",
              label: {
                en: "Male",
                kn: "ಪುರುಷ"
              },
              order: 1
            },
            {
              id: "gender_female",
              value: "female",
              label: {
                en: "Female",
                kn: "ಮಹಿಳೆ"
              },
              order: 2
            },
            {
              id: "gender_other",
              value: "other",
              label: {
                en: "Other",
                kn: "ಇತರೆ"
              },
              order: 3
            }
          ]
        }
      ]
    }
  ]
};
