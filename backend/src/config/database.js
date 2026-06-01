import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`mogodb connected${connectionInstance.connection.host}`);   
    } catch (error) {
        console.log("Error",error);
        process.exit(1)
    }
}
export default connectDB