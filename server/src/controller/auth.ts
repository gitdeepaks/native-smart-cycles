import { Context } from "hono";
import UserModel from "../models/user";
import AuthVerificationTokenModel from "../models/authVerificationToken";

export const createNewUser = async (c: Context) => {
  const rawData = await c.req.text();

  const { name, email, password } = JSON.parse(rawData);

  console.log({
    name,
    email,
    password,
  });

  if (!name || !email || !password) {
    return c.json(
      {
        message: "Please provide all the required fields",
      },
      {
        status: 400,
      }
    );
  }

  // Check if an account already exists or not

  const existingUser = await UserModel.findOne({
    email: email,
  });

  if (existingUser) {
    return c.json(
      {
        message: "An account with this email already exists",
      },
      {
        status: 400,
      }
    );
  }
  const user = await UserModel.create({
    name,
    email,
    password,
  });
  // Generate and store verification token.

  await AuthVerificationTokenModel.create({ owner: user._id, token: "token" });

  // Send verification link email to the user on registered mail.

  function generateRandomHex() {
    return Array.from({ length: 36 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0")
    ).join("");
  }

  function createVerificationLink() {
    const token = generateRandomHex(); // Call the function to get the token
    const url = `http://localhost:9000/verify?token=${token}`;
    return url;
  }

  // console.log(createVerificationLink()); // Print the URL with the token

  return c.text(createVerificationLink());
};
