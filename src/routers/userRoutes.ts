import express from "express";
import { PrismaClient } from "../../generated/prisma";
let UserRouter = express.Router()
import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth";

let prisma = new PrismaClient()

UserRouter.all('/auth/{*splat}',toNodeHandler(auth))

UserRouter.route('/getUser')

.all(async(req,res)=>{
    let users = await prisma.user.findMany()
    res.status(200).json(users)
})
export default UserRouter