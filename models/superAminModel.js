
import mongoose from "mongoose";
// import bcrypt from "bcrypt";

const SsuperadminSchema = new mongoose.Schema({
    
    name: String,
    adminCode:String
   
},
  { timestamps: true }
);



export default mongoose.model("Ssuperadmin", SsuperadminSchema);
