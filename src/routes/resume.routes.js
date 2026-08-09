import {
    deleteResume,uploadResume,getResume
} from "../controllers/resume.controller.js"
import {Router} from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import {upload} from "../middleware/multer.middleware.js"

const resumeRouter = Router()

resumeRouter.route("/upload-resume").post(verifyJWT,
    upload.fields([
        {
            name:"resumeFile",
            maxCount:1
        }
    ]),
    uploadResume)
resumeRouter.route("/delete-resume").delete(verifyJWT,deleteResume)
resumeRouter.route("/get-resume").get(verifyJWT,getResume)

export {resumeRouter}