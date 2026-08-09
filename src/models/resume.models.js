import mongoose from "mongoose";
import { User } from "./users.models.js";
const resumeSchema = new mongoose.Schema({
    resumeFile:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    
    resumePublicId: {
        type: String,
        default: ""
    },
    resumeAnalysis:{
    
        skills: {
            type: [String],
            default: []
        },
        projects: {
            type: [String],
            default: []
        },
        experienceLevel: {
            type: String,
            default: ""
        },
        strengths: {
            type: [String],
            default: []
        },
        weaknesses: {
            type: [String],
            default: []
        },
        missingSkills: {
            type: [String],
            default: []
        },
        resumeSuggestions: {
            type: [String],
            default: []
        },
        recommendedLearning: {
            type: [String],
            default: []
        }
    }
    
},
{
    timestamps:true
}
)

const Resume = mongoose.model("Resume" , resumeSchema)

export {Resume}