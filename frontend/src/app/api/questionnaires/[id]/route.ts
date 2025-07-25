import { NextRequest, NextResponse } from 'next/server';

// This would typically connect to your database
// For now, returning sample bilingual data structure

export async function GET() {
  try {
    // In production, this would fetch from your database:
    // const questionnaire = await db.questionnaires.findOne({
    //   where: { id: 'scsp-tsp-evaluation' },
    //   include: ['sections', 'questions', 'options']
    // });

    const questionnaireData = {
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
              id: "district",
              text: {
                en: "District/Taluk",
                kn: "ಜಿಲ್ಲೆ/ತಾಲ್ಲೂಕು"
              },
              type: "text",
              required: true,
              section_id: "section1",
              order: 2
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
              order: 3
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
              order: 4,
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
            },
            {
              id: "education",
              text: {
                en: "Education Level",
                kn: "ಶಿಕ್ಷಣ ಮಟ್ಟ"
              },
              type: "select",
              required: true,
              section_id: "section1",
              order: 5,
              options: [
                {
                  id: "edu_primary",
                  value: "primary",
                  label: {
                    en: "Primary",
                    kn: "ಪ್ರಾಥಮಿಕ"
                  },
                  order: 1
                },
                {
                  id: "edu_secondary",
                  value: "secondary",
                  label: {
                    en: "Secondary",
                    kn: "ಮಾಧ್ಯಮಿಕ"
                  },
                  order: 2
                },
                {
                  id: "edu_higher_secondary",
                  value: "higher_secondary",
                  label: {
                    en: "Higher Secondary",
                    kn: "ಉನ್ನತ ಮಾಧ್ಯಮಿಕ"
                  },
                  order: 3
                },
                {
                  id: "edu_graduate",
                  value: "graduate",
                  label: {
                    en: "Graduate",
                    kn: "ಪದವಿ"
                  },
                  order: 4
                },
                {
                  id: "edu_postgraduate",
                  value: "postgraduate",
                  label: {
                    en: "Post Graduate",
                    kn: "ಸ್ನಾತಕೋತ್ತರ"
                  },
                  order: 5
                }
              ]
            }
          ]
        },
        {
          id: "section2",
          title: {
            en: "Section 2: Socio-Economic Impact",
            kn: "ವಿಭಾಗ 2: ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಪ್ರಭಾವ"
          },
          order: 2,
          questions: [
            {
              id: "current_occupation",
              text: {
                en: "What is your current occupation?",
                kn: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಉದ್ಯೋಗ ಏನು?"
              },
              type: "text",
              required: true,
              section_id: "section2",
              order: 1
            },
            {
              id: "current_income",
              text: {
                en: "Current Income Level",
                kn: "ಪ್ರಸ್ತುತ ಆದಾಯ ಮಟ್ಟ"
              },
              type: "select",
              required: true,
              section_id: "section2",
              order: 2,
              options: [
                {
                  id: "income_below_50k",
                  value: "below_50k",
                  label: {
                    en: "Below ₹50,000",
                    kn: "₹50,000 ಕ್ಕಿಂತ ಕಡಿಮೆ"
                  },
                  order: 1
                },
                {
                  id: "income_50k_1l",
                  value: "50k_1l",
                  label: {
                    en: "₹50,000 - ₹1,00,000",
                    kn: "₹50,000 - ₹1,00,000"
                  },
                  order: 2
                },
                {
                  id: "income_1l_2l",
                  value: "1l_2l",
                  label: {
                    en: "₹1,00,000 - ₹2,00,000",
                    kn: "₹1,00,000 - ₹2,00,000"
                  },
                  order: 3
                },
                {
                  id: "income_above_2l",
                  value: "above_2l",
                  label: {
                    en: "Above ₹2,00,000",
                    kn: "₹2,00,000 ಕ್ಕಿಂತ ಹೆಚ್ಚು"
                  },
                  order: 4
                }
              ]
            }
          ]
        }
      ]
    };

    return NextResponse.json(questionnaireData);
  } catch (error) {
    console.error('Error fetching questionnaire:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questionnaire' },
      { status: 500 }
    );
  }
}

// POST endpoint to handle questionnaire responses
export async function POST(request: NextRequest) {
  try {
    const { questionnaireId, userId, responses } = await request.json();

    // In production, save to database:
    // await db.responses.create({
    //   questionnaire_id: questionnaireId,
    //   user_id: userId,
    //   responses: JSON.stringify(responses),
    //   submitted_at: new Date()
    // });

    console.log('Received response submission:', {
      questionnaireId,
      userId,
      responses
    });

    return NextResponse.json(
      { message: 'Response submitted successfully', id: 'mock-response-id' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting response:', error);
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    );
  }
}
