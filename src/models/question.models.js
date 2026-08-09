import mongoose from "mongoose"
import { User } from "./users.models.js"

const questionSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    interviewId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Interview"
    },
    marks:{
        type:Number,
        required:true
    },
    question:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:["Easy","Medium","Hard"],
        required:true
    },
    topic:{
        type:String,
        required:true
    },
    questionNo:{
        type:Number,
        required:true
    }

},
{
    timestamps:true
}
)

const Question=mongoose.model("Question",questionSchema)

export {Question}