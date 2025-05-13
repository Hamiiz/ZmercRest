import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { PrismaClient } from "../../../generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = express.Router();
const prisma = new PrismaClient();

const options: jwt.SignOptions = {
  expiresIn: 3600, // Explicit type fix
};

let secret = process.env.JWT_SECRET;

authRouter.route("/signup").post(async (req, res) => {
  const userData = req.body;
  const hash = await bcrypt.hash(userData.password, 10);
  let newUser=null;
  try{
     newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        username: userData.username,
        password: hash,
      },
    });
  } catch(err){
    res.status(500).send(err)
  }finally{
    await prisma.$disconnect()
  }
  res.status(200).send(newUser)

});

authRouter.route("/login")
.post(async (req, res) => {
  const userData = req.body;
  const user = await prisma.user.findUnique({
    where: { username: userData.username },
  });

  if (!user) {
     res.status(404).send("No user found");
  }else{

    const hash = user.password;
    await bcrypt.compare(userData.password, String(hash), (err, result) => {
      if (err) {
         res.status(500).send(err);
      }
      if (!result) {
         res.status(400).send("Incorrect Password!");
      }
  
      const payload = {
        id: user.id,
        username: user.username, // Fixed typo
        email: user.email,
      };
       jwt.sign(payload, String(secret), options, (err, token) => {
        if (err) {
           res.status(500).send("Error signing token");
        }
        // console.log(token);
        res.status(200).send(token);
      });
    });
  }

});

export default authRouter;