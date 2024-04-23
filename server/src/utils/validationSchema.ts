import * as y from "yup";

export const newUserSchema = y.object({
  name: y.string().required("Name is Missing"),
  email: y.string().email().required("Email is Missing"),
  password: y.string().required("Password is Missing"),
});
