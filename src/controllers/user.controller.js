import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/users.models.js"
import { ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { deleteFromCloudinary, uploadFileOnCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import mongoose, { isValidObjectId } from "mongoose"
import {application} from "express"
import {InterviewResult} from "../models/interviewResult.models.js"
import {Interview} from "../models/interview.models.js"

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    }catch(error){
        console.log("Token generation Error: ",error)
        throw new ApiError(500,"Something went wrong while generationg tokens")
    }
}

const getUserProfile = asyncHandler(async(req,res)=>{

    const userId=req.user._id

    const userProfile = await User.findById(userId)

    if(!userProfile){
        throw new ApiError(404,"No profile exist with your Id")
    }

    return res.status(201).json(new ApiResponse(201,userProfile,"User profile fetched successfully"))

})

const registerUser = asyncHandler(async(req,res)=>{


    const {fullName,email,password,role,experienceInYears} = req.body;

    const profileImageLocalPath = req.files?.profileImage?.[0]?.path

    if([fullName,email,password,role].some((field)=>!field?.trim())){
        throw new ApiError(400,"All fields are required")
    }

    if(!profileImageLocalPath){
        throw new ApiError(400,"Profile Image Local Path Not Exist")
    }

    const existedUser = await User.findOne({
        email:email
    })

    if(existedUser){
        throw new ApiError(400,"User exist")
    }

    const profile = await uploadFileOnCloudinary(profileImageLocalPath)

    if(!profile){
        throw new ApiError(404,"Error while uploading file on cloudinary")
    }
    
    const user=await User.create({
        email,
        password,
        role,
        fullName,
        profileImage:profile.url,
        profileImagePublicId:profile.public_id,
        experienceInYears
    })

    const createdUser = await User.findById(user?._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(400,"User not created ")
    }

    return res.status(201).json(new ApiResponse(201,createdUser,"User Created Successfully"))
    


})

const loginUser = asyncHandler(async(req,res)=>{
    const {email,password}=req.body

    if(!email?.trim() || !password?.trim()){
        throw new ApiError(400,"Email and Password required to login")
    }

    const user = await User.findOne({
        email:email
    })

    if(!user){
        throw new ApiError(400,"User is not registered")
    }

    const isPasswordValidate=await user.isPasswordCorrect(password)

    if(!isPasswordValidate){
        throw new ApiError(404,"Invalid Password or email")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const options={
        httpOnly:true,
        secure:true
    }
    console.log("accessToken:", accessToken);
    console.log("type:", typeof accessToken);
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User loggedIn successfully"))


})

const logOutUser = asyncHandler(async(req,res)=>{

        await User.findByIdAndUpdate(req.user._id,
            {
                $unset:{
                    refreshToken:1
                }   
            },
            {
                new:true
            }
        )

        const options= {
            httpOnly:true,
            secure:true
        }

        return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"User Logout Successfully"))

})

const updateProfile = asyncHandler(async(req,res)=>{
    const {fullName,email,password,experienceInYears,role}= req.body
    const updateFeature ={}
    const userId=req.user._id

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(400,"User is not valid")
    }


    updateFeature.fullName = fullName? fullName:user.fullName
    updateFeature.email = email? email:user.email
    updateFeature.role = role? role:user.role
    updateFeature.experienceInYears = experienceInYears? experienceInYears:user.experienceInYears

        const updatedUser = await User.findByIdAndUpdate(user._id,
            updateFeature,
        {
            new:true
        }
        )
        if(password){
            user.password=password
            await user.save()
        }
    return res.status(201).json(new ApiResponse(201,updatedUser,"User Updated Successfully"))


})

const updateProfileImage = asyncHandler(async(req,res)=>{

    const profileImageLocalPath = req.files?.profileImage[0]?.path

    if(!profileImageLocalPath){
        throw new ApiError(400,"ProfileImage does not exist")
    }

    if(!isValidObjectId(req.user._id)){
        throw new ApiError(400,"Invalid UserId")
    }


    const user = await User.findById(req.user._id)


    const profile = await uploadFileOnCloudinary(profileImageLocalPath)

    if(!profile){
        throw new ApiError(404,"Error in uploading file on cloudinary")
    }


    await deleteFromCloudinary(user.profileImagePublicId)

    const updatedProfileImage = await User.findByIdAndUpdate(req.user._id,{
        profileImage:profile.url,
        profileImagePublicId:profile.public_id
    },
    {
        new:true
    }
)

    return res.status(200).json(new ApiResponse(200,updatedProfileImage,"Profile image updated successfully"))

})

export {registerUser,loginUser,logOutUser,updateProfile,updateProfileImage,getUserProfile}




