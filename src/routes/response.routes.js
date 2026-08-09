import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    submitAnswer,
    getResponse
} from "../controllers/response.controller.js";

const responseRouter = Router();

responseRouter.route("/submit").post(
    verifyJWT,
    submitAnswer
);

responseRouter.route("/:responseId").get(
    verifyJWT,
    getResponse
);

export { responseRouter };