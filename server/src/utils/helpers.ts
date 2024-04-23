import { Context } from "hono";

export const sendError = (c: Context, message: string, status: number) => {
  c.json(
    {
      message,
    },
    {
      status,
    }
  );
};
