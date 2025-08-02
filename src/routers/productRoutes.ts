import 'dotenv/config'
import express from 'express'
import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '../../generated/prisma';
import validateToken from '../middlewares/jwtVerify';

import multer from 'multer';
import { verify } from 'jsonwebtoken';
const prodRouter = express.Router()
const prisma = new PrismaClient()
const upload = multer({ storage: multer.memoryStorage() }); // reads file into buffer

cloudinary.config({ 
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARYAPIKEY,
  api_secret: process.env.CLOUDIANRYSECRET

});
prodRouter.use('/products',validateToken)
prodRouter.route('/products')
.post( upload.single('image'), async (req, res) => {
    console.log(req.file)
  try {
    const fileBuffer = req?.file?.buffer;
    const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer||"").pipe(stream);
        });
      };
  
      const cloudinaryResult :any = await streamUpload();
      const {name, desc,price,stock,model,condition }= req?.body
      const product = {
        name:name,
        description:desc,
        price:parseFloat(price),
        stock:parseInt(stock),
        model:model,
        condition:condition,
        image:cloudinaryResult?.secure_url
      }
      
      await prisma.product.create({
          data:{...product,
              Owner:{
                  connect:{
                      id:req.user?.id
                  }
              }
          },
         
      })
     res.status(200).send('successful Upload, product created')


  } catch (err) {
    console.error(err);
     res.status(500).json({ error: err });
  }
});

prodRouter.route('/getProducts')
.get(async(req , res)=>{
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products)

  }catch(err){
    res.status(500).send(err)
  }
})

export default prodRouter