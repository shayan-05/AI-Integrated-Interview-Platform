import { User } from "../models/users.models.js";
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

export const verifyJWT=asyncHandler(async(req,res,next)=>{
    //console.log("1. verifyJWT started");
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(404,"User Unauthorized")
        }
       // console.log("2. Token:", token);
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401,"Invalid access token")
        }

        req.user=user
        //console.log("5. Calling next()");
        next()

    } catch(error){
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})