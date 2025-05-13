import express from "express";
import authRouter from "./subrouters/AuthRouter";
import { PrismaClient } from "../../generated/prisma";
let UserRouter = express.Router()

UserRouter.use('/auth',authRouter)
UserRouter.route('/getUser')
export default UserRouter