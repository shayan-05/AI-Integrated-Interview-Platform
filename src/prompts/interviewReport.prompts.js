import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {generateContent, generateContentFromFile} from "../services/ai.services.js"
import { extractJSON } from "../utils/json.utils.js"

async function interviewResult({questions,answers}){

    if(questions.length===0){
        throw new ApiError(404,"No question exist to generate result")
    }

    
    const prompt =`
    You are an experienced technical interviewer.
    generate Interview Result

        Questions:
        ${questions}

        Candidate Answers:
        ${answers}

        Evaluate the answer.

        Return ONLY valid JSON.
        {
            "totalMarksObtained":0
            "overallFeedback":""
            strengths:[
                {
                    ""
                }
            ],
            weaknesses:[
                {
                    ""
                }
            ],
            recommendations:[
                {
                    ""
                }
            ]
        }

        Do not use markdown.
        Do not explain anything.
        Return only JSON.
        
    `;

    const response = await generateContent(prompt);
    
    if(!response){
        throw new ApiError(500,"Error while generating Interview Result from AI");
    }

    const extractedResponse = extractJSON(response);

    return extractedResponse;

}

export{interviewResult}