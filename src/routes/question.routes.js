import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    getQuestion,getQuestions
} from "../controllers/question.controller.js";

const questionRouter = Router();

questionRouter.route("/questions/:interviewId").get(
    verifyJWT,
    getQuestions
);

questionRouter.route("/:questionId").get(
    verifyJWT,
    getQuestion
);




export { questionRouter };