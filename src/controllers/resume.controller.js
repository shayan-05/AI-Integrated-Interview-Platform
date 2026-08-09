import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadFileOnCloudinary,deleteFromCloudinary } from "../utils/cloudinary.js"
import { Resume } from "../models/resume.models.js"
import {analyzeResume} from "../prompts/analyzeResume.prompts.js"
const uploadResume= asyncHandler(async(req,res)=>{

    const resumeLocalPath = req.files?.resumeFile?.[0]?.path

    if(!resumeLocalPath){
        throw new ApiError(400,"Error no resumr file path exist")

    }

    const existingResume = await Resume.findOne({
        userId: req.user._id
    });

    if (existingResume) {
        throw new ApiError(400, "Resume already exists");
    }


    const analysis = await analyzeResume(resumeLocalPath);
    const upload = await uploadFileOnCloudinary(resumeLocalPath);

    if(!upload?.url){
        throw new ApiError(400,"Error while uploading resume on cloudinary")
    }
    
    

    const uploadedResume = await Resume.create({

    
        userId:req.user?._id,
        resumeFile:upload.url,
        resumePublicId:upload.public_id,
        resumeAnalysis:analysis
        }

    )

    res.status(201).json(new ApiResponse(201,uploadedResume,"Resume uploaded successfully"))

})

const deleteResume = asyncHandler(async(req,res)=>{

    
    const resume = await Resume.findOne({userId:req.user._id});

    if(!resume){
        throw new ApiError(400,"Resume not exist");
    }

    // if(resume.userId!==req.user._id){
    //     throw new ApiError(404,"Not Authorized to delete resume")
    // }

    const isDeleted = await deleteFromCloudinary(resume.resumePublicId);


    if(!isDeleted){
        throw new ApiError(404,"Error while deleting from cloudinary")
    }
    await Resume.findByIdAndDelete(resume._id);
    

    return res.status(200).json(new ApiResponse(200,{},"Resume deleted Successfully"));


})

const getResume = asyncHandler(async(req,res)=>{
    
    const userId = req.user._id

    const resume = await Resume.findOne({
        userId:userId
    })

    if(!resume){
        throw new ApiError(404,"Resume not fetched from database")
    }

    return res.status(200).json(new ApiResponse(200,resume,"Resume fetched successfully"))

})



export {
    deleteResume,uploadResume,getResume
}