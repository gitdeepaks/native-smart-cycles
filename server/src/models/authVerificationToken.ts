import { Schema, model } from "mongoose";

const schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

const AuthVerificationTokenModel = model("AuthVerificationToken", schema);
export default AuthVerificationTokenModel;
