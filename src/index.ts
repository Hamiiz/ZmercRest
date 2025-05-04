import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import cors from "cors";
 
const app = express();
const port = 1000;
 
app.all("/api/auth/{*any}", toNodeHandler(auth));
 
// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});