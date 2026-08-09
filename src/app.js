import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limits:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



import { userRouter } from "./routes/user.routes.js"
import { resumeRouter } from "./routes/resume.routes.js"
import { questionRouter } from "./routes/question.routes.js"
import { responseRouter } from "./routes/response.routes.js"
import { interviewRouter } from "./routes/interview.routes.js"

app.use("/api/v1/questions",questionRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/response",responseRouter)
app.use("/api/v1/resume",resumeRouter)
app.use("/api/v1/interview",interviewRouter)

export default app