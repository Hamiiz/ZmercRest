import express from "express";
import cors from "cors";
import {PrismaClient} from "../generated/prisma";
import UserRouter from "./routers/userRoutes";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth"; // Your Better Auth instance
import SendEmail from "./services/email";
import prodRouter from "./routers/productRoutes";
import paymentRouter from "./routers/paymentRoutes";


const app = express();
const port = 1000;
let prisma = new PrismaClient()


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true
    
}));
app.use(UserRouter)
app.use(prodRouter)
app.use(paymentRouter)

app.route('/')
.get(async (req, res) => {
    let users
    try {
         users = await prisma.user.findMany(); // Await the query
         let otp =await SendEmail('hmmhsd37@gmail.com','Hamza Mo',454554)
         res.send(otp)
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    } finally {
        await prisma.$disconnect(); // Disconnect in the finally block
    }
});
 
app.get("/api/me", async (req, res) => {
 	const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
	res.json(session);
});


app.listen(port, () => {
    console.log(`listening on port ${port}`);
    
});