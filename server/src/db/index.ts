import { connect } from "mongoose";

const url = process.env.MONGO_URI;

connect(url || "")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));
