// // models/userModel.js
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     suid: { type: String, required: true },
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     accesstoken: { type: String },
//     sessionAccesstoken: { type: String },
//     emailVerifyAccesstoken:{type: String},
//     emailVerify:{type: Boolean}
//   },
//   { timestamps: true }
// );

// const Suser = mongoose.model("Suser", userSchema);
// export default Suser;

/////////////////////

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SuserSchema = new mongoose.Schema({
    suid: String,
    sprovid: String,
    name: String,
    email: String,
    mobile: String,
    password: String,
    roll: { type: String, default: "1" },
    accesstoken: String,
    sessionAccesstoken: String,
    emailVerifyAccesstoken: String,
    emailVerify: Boolean,
},
  { timestamps: true }
);

// Hash password before saving
SuserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare Password
SuserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Suser", SuserSchema);
