import express, { Request } from "express";
// At the top of your route file

import { PrismaClient } from "../../generated/prisma";
let UserRouter = express.Router()
import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth";
import  validateToken  from "../middlewares/jwtVerify";

let prisma = new PrismaClient()
  
UserRouter.all('/auth/{*splat}',toNodeHandler(auth))
UserRouter.use('/getuser',validateToken)
UserRouter.route('/getuser')
.all(async(req,res)=>{
    console.log(req.user)
    let users = await prisma.user.findMany()
    res.status(200).json(users)
})
export default UserRouter