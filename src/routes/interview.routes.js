import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import {
    generateInterviewResult,getInterviewResult
} from "../controllers/interviewResult.controller.js"
import {getAllInterview,getOneInterview,createInterview} from "../controllers/interview.controller.js"

const interviewRouter=Router()

interviewRouter.route("/create-interview").post(verifyJWT,createInterview)
interviewRouter.route("/get-interview").get(verifyJWT,getOneInterview);
interviewRouter.route("/get-allinterview").get(verifyJWT,getAllInterview)
interviewRouter.route("/create-result/:interviewId").post(
    verifyJWT,
    generateInterviewResult
);

interviewRouter.route("/result/:interviewId").get(
    verifyJWT,
    getInterviewResult
);

export{interviewRouter}
