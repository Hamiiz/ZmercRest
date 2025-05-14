import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins"
import { PrismaClient } from "../generated/prisma";
 
const prisma = new PrismaClient({
    log: [ 'error', 'warn'],
  });
  
export const auth = betterAuth({
    basePath:"/auth",
    trustedOrigins:['http://localhost:5173'],
    database: prismaAdapter(prisma, {
        provider: "postgresql" // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {  
        enabled: true,
        autoSignIn:false
    
    },
    additionalFields: {
        // username: {
        //   type: "string",
        //   required: false,

        // },
    },
    plugins: [
        username({
            minUsernameLength: 5,
            
        })
    ],
    advanced: {
        database: {
        //   generateId: false,
        },
    },
  

});
