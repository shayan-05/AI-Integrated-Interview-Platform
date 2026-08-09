import mongoose from "mongoose"
import { User } from "./users.models.js"
const interviewSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    
    difficulty:{
        type:String,
        enum:["Easy","Medium","Hard"],
        required:true,
    },
    durationInMinutes:{
        type:Number,
        enum:[60,120,150,180],
        required:true,
        default:60
    },
    startedAt:Date,

    endedAt:Date,

    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed", "Cancelled"],
        required:true,
        default: "Pending"
    },
    role:{
        type:String,
        enum:[
            "Frontend",
            "Backend",
            "Full Stack",
            "Machine Learning",
            "HR",
            "System Design" ,
            "Software Engineer",
            "Technical"
        ],
        required:true,
        default:"Software Engineer"
    }
},
{
    timestamps:true
}
)

const Interview=mongoose.model("Interview",interviewSchema)

export {Interview}