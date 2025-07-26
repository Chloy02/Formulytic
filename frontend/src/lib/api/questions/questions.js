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

export async function getQuestionById(id) {
    const response = await axios.get(`${ServerLink}/questions/id/${id}`);
    console.log("Question By ID: ", response.data);
    return response.data;
}


export {
    getQuestionById,
    getQuestionHome
};
