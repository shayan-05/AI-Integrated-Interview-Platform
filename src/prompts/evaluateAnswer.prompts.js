import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {generateContent, generateContentFromFile} from "../services/ai.services.js"
import { extractJSON } from "../utils/json.utils.js"

async function evaluateAnswer({content,answer,marks,difficulty}){
   // console.log("Question ",content," Answer",answer)
    if(!content || !answer){
        throw new ApiError(404,"All paramteres are required")
    }

    
    const prompt =`
    You are an experienced technical interviewer.

        Question:
        ${content}

        Candidate Answer:
        ${answer}

        Marks:
        ${marks}

        Difficulty:
        ${difficulty}

        Evaluate the answer.

        Return ONLY valid JSON.

        {
            "feedback":"",
            "topic":"",
            "difficulty":"",
            "marksObtained":0
        }

        Do not use markdown.
        Do not explain anything.
        Return only JSON.
        
    `;

    const response = await generateContent(prompt);
    
    if(!response){
        throw new ApiError(500,"Error while evaluating answer from AI");
    }

    const extractedResponse = extractJSON(response);

    return extractedResponse;

}
export{evaluateAnswer}