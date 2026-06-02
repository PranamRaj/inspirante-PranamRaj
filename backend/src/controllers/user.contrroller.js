import {User} from "../models/user.model.js"

const registerUser=async(req,res)=>{
    try {
        const{username,password}=req.body;

        const existing=await User.findOne({username:username,password:password});
        if(!existing){
            throw new console.error("invalid");
        }
        res.status(201).json({message:"User exist"});
    } catch (error) {
        
    }
}
export {
    registerUser
};