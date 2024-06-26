import { Document, Schema, model } from "mongoose";
import { hash, compare, genSalt } from "bcrypt";

interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
}

interface Methods {
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (this.isModified("password")) {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt); // Await the hash result before assigning
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

const UserModel = model("User", userSchema);

export default UserModel;
