import express, { Request } from "express";
// At the top of your route file

import { PrismaClient } from "../../generated/prisma";
let UserRouter = express.Router()
import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth";
import  validateToken  from "../middlewares/jwtVerify";
import { jwt } from "better-auth/plugins";


let prisma = new PrismaClient()
  
UserRouter.all('/auth/{*splat}',toNodeHandler(auth))
UserRouter.use('/getuser',validateToken)
UserRouter.route('/getuser')
.all(async(req,res)=>{
    console.log(req.user)
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
    console.log(data)
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
        if(select.length<3){
            [...select].forEach(async num=>{
                    await prisma.userRoles.create({
                        data:{
                            Uid:id,
                            RoleId:Number(num)
                        }
                    })

            })
        }else{
            res.status(403).send('invalid role')
        }
    
        res.status(200).send('Update Successfull')
    }catch(error){
        res.status(401).json(error)
    }finally{
        await prisma.$disconnect()
    }
    
})



UserRouter.use('/addroles',express.json())
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