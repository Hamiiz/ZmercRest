import 'dotenv/config'
import  {Request,Response,NextFunction,RequestHandler} from 'express'
import { jwtVerify, createRemoteJWKSet } from 'jose'

let  validateToken : RequestHandler = async (req:Request,res:Response,next:NextFunction) =>{
    try {
    let token = req.headers.authorization?.split(" ")[1]
    if (!token){
        res.status(401).json({ message: "Missing token" });
        return; // or return undefined;
            }
    const JWKS = createRemoteJWKSet(
      new URL('http://localhost:1000/auth/jwks')
    )

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.JWT_ISSUER, // Should match your JWT issuer, which is the BASE_URL
      audience: 'Zmercado', // Should match your JWT audience, which is the BASE_URL by default
    })
    console.log(payload)
    req.user = payload as Request["user"]
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}
 

export default validateToken