import mongoose from "mongoose"


const responseSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    questionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Question",
        required:true
    },
    interviewId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Interview",
        required:true
    },
    marksObtained:{
        type:Number,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    feedback:{
        type:String,
        default:""
    },
    // timeTaken:{
    //     type:Number
    // }
    
},
{
    timestamps:true
}
)

const Response=mongoose.model("Response",responseSchema)

export {Response}