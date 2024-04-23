import { Hono } from "hono";
import { createNewUser } from "../controller/auth";
import validate from "../middleware/validator";
import { Schema } from "mongoose";
import { newUserSchema } from "../utils/validationSchema";

const authRoute = new Hono();

authRoute
  .post("/sing-in", (c) => {
    return c.json(
      { message: "Login successful" },
      {
        status: 200,
      }
    );
  })
  .post("/sign-up", validate(newUserSchema), createNewUser)
  .post("/veryfy", (c) => {
    return c.json({ message: "Register successful" });
  });

export default authRoute;
