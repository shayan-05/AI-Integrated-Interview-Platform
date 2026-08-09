import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {generateContent, generateContentFromFile} from "../services/ai.services.js"
import { extractJSON } from "../utils/json.utils.js"

async function generateQuestions({role,difficulty,durationInMinutes,resumeAnalysis}){

    if(!role || !difficulty || !durationInMinutes){
        throw new ApiError(404,"All paramteres are required")
    }

    const noOfQuestions = Math.ceil(durationInMinutes/20);
    const prompt =`
        Generate interview questions.

        Role:
        ${role}

        Difficulty:
        ${difficulty}

        Interview Duration:
        ${durationInMinutes} minutes.
        Also i have added resume analysis what is written on resume of user
        The interview should fit comfortably within ${durationInMinutes} minutes so give question accordingly to difficulty .
        also give marks to each question
        Return ONLY valid JSON.

        Do NOT use markdown.

        Do NOT use json

        Do NOT explain anything.
        Format:

        [
        {
            "questionText":"",
            "topic":"",
            "difficulty":"",
            "marks":"",
            "questionNo":1
        }
        ]
        `;

    const response = await generateContent(prompt);
    
    if(!response){
        throw new ApiError(500,"Error while generating question from AI");
    }

    const extractedResponse = extractJSON(response);

    return extractedResponse;

}

export {generateQuestions}