import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";

import { Interview } from "../models/interview.models.js";
import { Question } from "../models/question.models.js";
import { Response } from "../models/response.models.js";
import { InterviewResult } from "../models/interviewResult.models.js";

import { interviewResult } from "../prompts/interviewReport.prompts.js";


const generateInterviewResult = asyncHandler(async (req, res) => {

    const { interviewId } = req.params;

    if (!isValidObjectId(interviewId)) {
        throw new ApiError(400, "Invalid interview ID");
    }

    // Check interview belongs to logged-in user
    const interview = await Interview.findOne({
        _id: interviewId,
        userId: req.user._id
    });

    if (!interview) {
        throw new ApiError(404, "Interview not found");
    }

    // Get questions
    const questions = await Question.find({
        interviewId
    });

    if (!questions.length) {
        throw new ApiError(404, "No questions found for this interview");
    }

    // Get user's answers
    const responses = await Response.find({
        interviewId,
        userId: req.user._id
    });

    if (!responses.length) {
        throw new ApiError(400, "No answers submitted");
    }

    // Send questions + answers to AI
    const result = await interviewResult({
        questions,
        answers: responses
    });

    if (!result) {
        throw new ApiError(
            500,
            "Error while generating interview result"
        );
    }

    // Save result
    const savedResult = await InterviewResult.create({
        userId: req.user._id,
        interviewId: interview._id,
        marksObtained: result.totalMarksObtained,
        feedback: result.overallFeedback,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        recommendations: result.recommendations
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            savedResult,
            "Interview result generated successfully"
        )
    );
});

const getInterviewResult = asyncHandler(async(req,res)=>{
    const {interviewResultId}=req.params

    if(!isValidObjectId(interviewResultId)){
        throw new ApiError(404,"Interview Result Id")
    }

    const interviewResult = await InterviewResult.findById(interviewResultId);

    if(!interviewResult){
        throw new ApiError(404,"Interview Result not exist")
    }

    return res.status(200).json(new ApiResponse(200,interviewResult,"Interview Result fetched successfully"))
})


export {
    generateInterviewResult,getInterviewResult
};