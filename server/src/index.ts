import "./db/index";
import { Hono } from "hono";
import authRoute from "./routes/auth";
import { Context, Next } from "hono";
import { sendError } from "./utils/helpers";

const app = new Hono();

// Utility function to wrap route handlers
function asyncWrapper(fn: (c: Context) => Promise<any>) {
  return async (c: Context) => {
    try {
      return await fn(c);
    } catch (err) {
      console.error(err); // Log the error for debugging
      if (err instanceof Error) {
        return sendError(c, err.message, 500);
      } else {
        return sendError(c, "An unexpected error occurred", 500);
      }
    }
  };
}

// Apply a simple error middleware that logs unexpected errors
app.use("*", async (c: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    console.error("Unexpected Error:", err);
    return sendError(c, "An unexpected error occurred", 500);
  }
});

// Home route
app.get(
  "/",
  asyncWrapper(async (c: Context) => {
    return c.text("<h1>Hello Hono!</h1>");
  })
);

// Post route example
app.post(
  "/",
  asyncWrapper(async (c: Context) => {
    console.log(c.req.param());
    return c.text("<h1>Hello Hono this is chained!</h1>");
  })
);

// Auth route
app.route("/auth", authRoute);

// Export the configured app
export default {
  port: 9000,
  fetch: app.fetch,
  message: `Server is running on http://localhost:9000`,
};
