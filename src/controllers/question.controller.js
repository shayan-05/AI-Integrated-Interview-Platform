import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Question} from "../models/question.models.js"
import { isValidObjectId } from "mongoose";


const getQuestion = asyncHandler(async(req,res)=>{
    const {questionId} = req.params

    if(!isValidObjectId(questionId)){
        throw new ApiError(404,"Invalid Question Id");
    }

    const question = await Question.findById(questionId);

    if(!question){
        throw new ApiError(404,"Question not exist with that id");
    }

    // if(question.userId!==req.user._id){
    //     throw new ApiError(404,"Unauthorized to access question");
    // }

    return res.status(200).json(new ApiResponse(200,question,"Question fetched successfully"))
})
const getQuestions = asyncHandler(async(req,res)=>{
    const {interviewId}=req.params

    

    const questions = await Question.find({interviewId});

    if (!questions || questions.length === 0) {
        throw new ApiError(404, "Questions do not exist for this interview");
    }

    if (questions[0].userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to access questions");
    }

   

    return res.status(200).json(new ApiResponse(200,questions,"Question fetched successfully"))
})



export {getQuestion,getQuestions}

