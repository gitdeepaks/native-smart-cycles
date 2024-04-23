import { Context, Next } from "hono";
import * as yup from "yup";
import { sendError } from "../utils/helpers";

const validate = (schema: yup.Schema) => {
  return async (c: Context, next: Next) => {
    try {
      await schema.validate({ ...c.body }, { strict: true, abortEarly: true });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return sendError(c, error.errors.join(", "), 422);
      } else {
        next();
      }
    }
  };
};

export default validate;
