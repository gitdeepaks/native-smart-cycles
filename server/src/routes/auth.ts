import { Hono } from "hono";
import { createNewUser } from "../controller/auth";

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
  .post("/sign-up", createNewUser)
  .post("/veryfy", (c) => {
    return c.json({ message: "Register successful" });
  });

export default authRoute;
