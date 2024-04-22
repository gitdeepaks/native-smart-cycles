import "./db/index";
import { Hono } from "hono";
import authRoute from "./routes/auth";

const app = new Hono();

app
  .get("/", (c) => {
    return c.text("<h1>Hello Hono!</h1>");
  })
  .post("/", (c) => {
    console.log(c.req.param());
    return c.text("<h1>Hello Hono this is chained !</h1>");
  })
  .route("/auth", authRoute);

export default {
  port: 9000,
  fetch: app.fetch,
};
