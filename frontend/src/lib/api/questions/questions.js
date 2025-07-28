import ServerLink from "../serverURL";
import axios from 'axios';

async function getQuestionHome() {
    try {
        const response = await axios.get(`${ServerLink}/questions`);

        return response.data;
    } catch (err) {
        console.error("Error fetching data:", err);
        throw err;
    }
}

// lib/api/questions/questions.ts
// interface SectionData {
//   id: string
//   title: string
//   description: string
//   icon: string
//   questionCount: number
// }
async function getQuestionById(id) {
    try {
        const response = await axios.get(`${ServerLink}/questions/id/${id}`)

        if (!Array.isArray(response.data)) {
            console.error("Unexpected response structure:", response.data)
            return null
        }

        const sections = response.data.flatMap((e) =>
            e.sections.map((section) => ({
                id: section._id || '',
                title: section.sectionTitle || '',
                description: section.sectionDescription || '',
                icon: section.icon || '',
                questionCount: Array.isArray(section.questions) ? section.questions.length : 0,
                questions: section.questions,
            }))
        )

        return sections
    } catch (err) {
        console.error("Failed to fetch question by ID:", err)
        return null
    }
}



export {
    getQuestionById,
    getQuestionHome
};
