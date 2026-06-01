import dotenv from "dotenv";
import connectDB from "./config/database";
import app from "./app.js";

dotenv.config({
    path: './.env'
});

const startServer = async()=>{
    try{
        await connectDB();
        app.on("error",(error)=>{
            console.log("error",error);
            throw error;
        });
        app.listen(process.env.PORT||5001,()=>{
            console.log(`serverport${process.env.PORT}`)
        });
    }catch(error){
        console.log("Error!!",error);
    }
}

startServer();