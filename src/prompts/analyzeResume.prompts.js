import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {generateContent, generateContentFromFile} from "../services/ai.services.js"
import { extractJSON } from "../utils/json.utils.js"

async function analyzeResume(resumePath){

    if(!resumePath){
        throw new ApiError(400,"Resume path is required")
    }
    const prompt =`Analyze resume of user tell him weakness and what to improve to make resume strong and what to learn accordingly 
    
        {
            "skills": [],
            "projects": [],
            "experienceLevel": "",
            "strengths": [],
            "weaknesses": [],
            "missingSkills": [],
            "resumeSuggestions": [],
            "recommendedLearning": [],
            
        }

        Do not return markdown.
        Do not return explanation.
        Return only JSON.    `;

    const response = await generateContentFromFile(prompt,resumePath);
    
    if(!response){
        throw new ApiError(500,"Error while generating question from AI");
    }

    const extractedResponse = extractJSON(response);

    return extractedResponse;

}

export {analyzeResume}