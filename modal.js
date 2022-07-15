import mongoose  from "mongoose";

const userSchema=mongoose.Schema({
     message: String,



    
});

export default mongoose.model("messagecontents",userSchema);