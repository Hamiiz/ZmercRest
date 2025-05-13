import express from "express";
import cors from "cors";
import {PrismaClient} from "../generated/prisma";
import UserRouter from "./routers/userRoutes";


const app = express();
const port = 1000;
let prisma = new PrismaClient()

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '{*any}');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(UserRouter)

app.route('/')
.get(async (req, res) => {
    let users
    try {
         users = await prisma.user.findMany(); // Await the query
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    } finally {
        await prisma.$disconnect(); // Disconnect in the finally block
    }
    res.json(users).status(200)
})


app.listen(port, () => {
    console.log(`listening on port ${port}`);
    
});