import { Context } from "hono";

export const createNewUser = async (c: Context) => {
  const { name, email, password } = c.req.param();

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
  // Further logic to handle user creation

  return c.json({
    message: "User created successfully",
  });
};
