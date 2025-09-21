import 'dotenv/config'
import { betterAuth, createLogger, logger } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, username,jwt, getJwtToken,anonymous } from "better-auth/plugins"
import { PrismaClient } from "../generated/prisma";
import { emailOTP } from "better-auth/plugins"
import SendEmail from './services/email';

const prisma = new PrismaClient({
    log: [ 'error', 'warn'],
  });
  
export const auth = betterAuth({
logger:{
    level:'info',
},
    basePath:"/auth",
    crossOrigin: true,
    trustedOrigins:[process.env.FRONTEND_URL as string ],
    database: prismaAdapter(prisma, {
        provider: "postgresql" // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {  
        enabled: true,
        autoSignIn:true,
    },

    socialProviders: {
        google: { 
            prompt: "select_account", 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            redirectURI: "http://localhost:1000/auth/callback/google",
            overrideUserInfoOnSignIn:true,
            mapProfileToUser: (profile) => {
                return {
                    name: `${profile.given_name} ${profile.family_name}`,
                  email:profile.email,
                  image:profile.picture
                  
                }
            }, 
        }, 
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
            redirectURI: "http://localhost:1000/auth/callback/github",
            overrideUserInfoOnSignIn:true,
            mapProfileToUser: (profile) => {
                return {
                  name: `${profile.name} `,
                  email:profile.email,
                  username:profile.gravatar_id ,
                  image:profile.avatar_url
                    
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
              audience: 'Zmercado',
              expirationTime: "1h",
              definePayload: async ({ user }) => {
                // Fetch user roles from the database
                const userWithRoles = await prisma.user.findUnique({
                  where: { id: user.id },
                  include: { UserRoles: { include: { role: true } } }, // Include roles
                });
          
                if (!userWithRoles) {
                  throw new Error("User not found");
                }
          
                // Extract role names
                const roles = userWithRoles?.UserRoles.map((userRole) => userRole.role.name);
          
                return {
                  id: user.id,
                  email: user.email,
                  roles, // Include roles in the payload
                };
              },
            },
          }),
        anonymous({})
        ,
        emailOTP({
            otpLength:6,
            async sendVerificationOTP({ email, otp, type}) { 
                
                // Implement the sendVerificationOTP method to send the OTP to the user's email address
            await SendEmail(email,'Human', Number(otp))
     
            }, 
            // sendVerificationOnSignUp:true,

    }) 
    ],
    hooks: {
     
        
    },
    advanced:{
        cookiePrefix:"Zmercado",
        cookies: {
            session_token: {
              name: "Zmercado.session_token",
              attributes: {
                path: "/",              // required
                sameSite: "none",       // allow cross-site cookies
                secure: true,           // must be true in production (HTTPS)
                httpOnly: true,         // prevents JS access
                maxAge: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
   
    }

});
