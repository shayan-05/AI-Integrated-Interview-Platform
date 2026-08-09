import {Router} from "express"
import {registerUser,loginUser,logOutUser,updateProfile,updateProfileImage, getUserProfile} from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
const userRouter =Router()

userRouter.route("/register").post(
    upload.fields([
        {
            name:"profileImage",
            maxCount:1
        }
    ]),
    registerUser
)

userRouter.route("/login").post(loginUser)
userRouter.route("/get-user").get(verifyJWT,getUserProfile)
userRouter.route("/logOut").post(verifyJWT,logOutUser)
userRouter.route("/update-profile").patch(verifyJWT,updateProfile)
userRouter.route("/update-image").patch(verifyJWT,
    
    upload.fields([
        {
            name: "profileImage",
            maxCount: 1
        }
    ]),

    updateProfileImage)

export {userRouter}

