import { Context } from "hono";
import UserModel from "../models/user";
import AuthVerificationTokenModel from "../models/authVerificationToken";
import nodemailer from "nodemailer";
import { sendError } from "../utils/helpers";

function generateRandomHex() {
  return Array.from({ length: 36 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0")
  ).join("");
}

function createVerificationLink(token: string) {
  const url = `http://localhost:9000/verify?token=${token}`;
  return url;
}

export const createNewUser = async (c: Context) => {
  // Parse incoming request data
  const rawData = await c.req.text();
  const { name, email, password } = JSON.parse(rawData);

  // Validate input
  if (!name || !email || !password) {
    return sendError(c, "Please provide all the required fields", 422);
  }

  // Check for existing user
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return sendError(c, "User already exists", 409);
  }

  // Create new user and hash password
  const user = await UserModel.create({ name, email, password });

  // Assume comparePassword checks the password correctly
  const passwordIsValid = await user.comparePassword(password);
  if (!passwordIsValid) {
    return sendError(c, "Password validation failed", 401);
  }

  // Generate verification token
  const token = generateRandomHex();
  await AuthVerificationTokenModel.create({ owner: user._id, token });

  // Create verification link
  const verificationLink = createVerificationLink(token);

  // Setup email transport
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "0f09f22782a320",
      pass: "171ab2d7ccd774",
    },
  });

  // Send verification email
  await transport.sendMail({
    from: "verification@smartcycles.com",
    to: user.email,
    subject: "Verify Your Email",
    html: `<h1>Click on the link below to verify your email</h1><a href="${verificationLink}">Verify Email</a>`,
  });

  // Return successful response
  return c.json(
    { message: "Please check your email for verification link" },
    201
  );
};
