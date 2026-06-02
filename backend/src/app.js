import express from "express";
import userRouter from "./routes/user.routes";

const app = expree();

app.use(express.json());

app.use("api/v1/users",userRouter); 

export default app;