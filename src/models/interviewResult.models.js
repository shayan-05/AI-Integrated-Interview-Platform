import mongoose from "mongoose"


const interviewResultSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
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
    overallFeedback:{
        type:String,
        default:""
    },
    strength:[
        {
            type:String,
        }
    ],
    weakness:[
        {
            type:String
        }
    ],
    recommendations:[
        {
            type:String
        }
    ]

},
{
    timestamps:true
}
)

const InterviewResult=mongoose.model("InterviewResult",interviewResultSchema)

export {InterviewResult}