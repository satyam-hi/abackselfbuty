
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const providerSchema = new mongoose.Schema(
  {
    sprovid: String,
    name: String,
    email: { type: String, unique: true },
    mobile: String,
    password: String,
    roll: { type: String, default: "2" },

    cityId: {
      type: String,
      default: null,
    },

    localAreaId: {
      type: String,
      default: null,
    },

    serviceIds: [
      {
        type: String,
      },
    ],

    payment_due: {
      type: Boolean,
      default: false,
    },
    amount_due: String,
    accesstoken: String,
    sessionAccesstoken: String,
    emailVerifyAccesstoken: String,
    additionalDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: String,
    emailVerify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// Hash password before saving
providerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
providerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Sprovider", providerSchema);
