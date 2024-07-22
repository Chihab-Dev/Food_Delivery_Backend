import bodyParser from "body-parser";
import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import path from "path";
import { MONGO_URI } from "./config";

import { AdminRoute, VendorRoute } from "./routes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// to acces the image folder from the server
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);

mongoose
  .connect(MONGO_URI, {
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then((result) => console.log("Connected to the server : " + MONGO_URI))
  .catch((error) => console.log("error" + error));

app.listen(8000, () => {
  console.clear();
  console.log("listening to port 8000");
});
