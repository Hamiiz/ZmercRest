import express, { Request } from "express";

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
    let users = await prisma.user.findMany()
 
    res.status(200).json(users)
})
UserRouter.use('/add_info',validateToken,express.json())
UserRouter.route('/add_info')
.post(async(req,res)  =>{
    let data = req.body
    if (!data){
        res.status(401)
    }
    let {id,name,phone,select} = data
    try{
        await prisma.user.update({
            where:{
                id:id
            },
            data:{
                name:name
            }
        })
        if(select.length<=13){
            const roles = select.split('').map(Number); // splits every character into a number

            for (const roleId of roles) {
                await prisma.userRoles.create({
                    data: {
                        Uid: id,
                        RoleId: roleId
                    }
                });
            }

            res.status(200).send('Update Successfull')
        }
        res.status(403).send('invalid role')
    
    }catch(error:any){
        res.status(error?.status).json(error)
    }finally{
        await prisma.$disconnect()
    }
    
})



UserRouter.use('/addroles',validateToken,express.json())
UserRouter.route('/addroles')
.post(async (req,res)=>{
    let data = req.body;
    try{
        if(data){
            await prisma.roles.create({
                data:{
                    name:data.name
                }
            })
             res.status(200).send('role created successfully')
        }
    } catch(error){
         res.status(500).send(error)
    }

})
.get(async(req,res)=>{
    try{
        let user = req.user
        res.status(200).json(user)
    }
    catch(error){
        res.status(500).send(error)
    }
})







export default UserRouter