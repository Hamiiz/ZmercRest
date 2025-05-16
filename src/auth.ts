import 'dotenv/config'
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, username,jwt, getJwtToken } from "better-auth/plugins"
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
    socialProviders: {
        google: { 
            prompt: "select_account", 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            redirectURI:'http://localhost:5173',
            mapProfileToUser: (profile) => {
                return {
                  name: `${profile.given_name} ${profile.family_name}`,
                  email:profile.email,
                    
                }
            }, 
        }, 
    },

    plugins: [
        username({
            minUsernameLength: 5,    
        }),
        jwt({
            jwt: {
                
                issuer: process.env.JWT_ISSUER,
                audience:'Zmercado',
                expirationTime: "1h",
            
              definePayload: ({user}) => {
                return {
                  id: user.id,
                  email: user.email,
                  role: user.role
                }
              },

            }
          })
    ],
    hooks: {
        after:createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                return {
                    context: {
                        path: ctx.path, // if needed
                        method: ctx.method, // if needed
                        body: {
                            ...ctx.body,
                            username: username,
                       
                        },
                    },
                };
            }
        }),
        
    },

});
