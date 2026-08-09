import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Response} from "../models/response.models.js"
import { isValidObjectId } from "mongoose";
import { Question } from "../models/question.models.js";
import { evaluateAnswer } from "../prompts/evaluateAnswer.prompts.js";

const submitAnswer = asyncHandler(async(req,res)=>{

    const {questionId,answer} =req.body;

    if(!isValidObjectId(questionId)){
        throw new ApiError(404,"Invalid question Id")
    }

    if (!answer?.trim()) {
        throw new ApiError(400, "Answer is required");
    }

    const question = await Question.findById(questionId)

    if(!question){
        throw new ApiError(404,"No question exist with that Id")
    }

    if (!question.userId.equals(req.user._id)) {
        throw new ApiError(403, "Unauthorized");
    }
   // console.log(question)
    const content = question.question
    const marks = question.marks
    const difficulty = question.difficulty
    const evaluation = await evaluateAnswer({content,answer,marks,difficulty})

    const response = await Response.create({
        userId: req.user._id,
        questionId,
        interviewId: question.interviewId,
        answer,
        marksObtained: evaluation.marksObtained,
        feedback: evaluation.feedback
    });

    return res.status(201).json(
        new ApiResponse(201, response, "Answer evaluated successfully")
    );

 
})

const getResponse= asyncHandler(async(req,res)=>{

    const {responseId} = req.params

    if(!isValidObjectId(responseId)){
        throw new ApiError(404,"Invalid Response Id")
    }

    const response = await Response.findById(responseId)

    if(!response){
        throw new ApiError(404,"No response exist with that id");
    }

    return res.status(201).json(
        new ApiResponse(201, response, "Response Fetched Successfully")
    );

})

export {submitAnswer,getResponse}