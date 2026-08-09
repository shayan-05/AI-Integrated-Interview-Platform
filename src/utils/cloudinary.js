import "dotenv/config";
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET
})
//console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
//console.log("API key:", process.env.CLOUDINARY_API_KEY);
//console.log(
  //  "API secret exists:",
    //!!process.env.CLOUDINARY_API_SECRET
//);
const uploadFileOnCloudinary = async(filePath)=>{
    try{
        if(!filePath){
            return null
        }
        const response = await cloudinary.uploader
        .upload(filePath,{
            resource_type:"auto"
        })

        fs.unlinkSync(filePath)
        return response

    }catch(error){
        console.log("Cloudinary Upload Error:", error);
        if(fs.existsSync){
            fs.unlinkSync(filePath)
        }
        
        return null

    }
}

const deleteFromCloudinary = async(public_id,resource_type="image")=>{
    try{
        const response = await cloudinary.uploader.destroy(public_id,{resource_type:resource_type,invalidate:true})

        return response 
    }catch(error){
        return null
    }
}

export {uploadFileOnCloudinary,deleteFromCloudinary}

