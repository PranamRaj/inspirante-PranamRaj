import mongoose,{Schema} from mongoose;

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            minLenght:4,
            maxLength:20
        },
        password:{
            type:String,
            required:true,
            trim:true,
            minLenght: 6,
            maxLength: 20
        }
    },
    {
        timestamps:true
    }
)
export const User=mongoose.model("User",userSchema)
