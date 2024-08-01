import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export default async () => {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.log("error" + error);
  }

  console.log("Connected to the server : " + MONGO_URI);
};
