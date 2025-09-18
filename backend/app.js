import express from "express";
import cors from "cors";
import dataRouter from "./routers/data.router.js";
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(
    cors(corsOptions)
)

app.use(express.json({ limit: "16kb" }));
// allow data in url encoded format 
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
// serving assets like images , css
app.use(express.static("public"))

app.use("/api/v1/", dataRouter);

export default app;