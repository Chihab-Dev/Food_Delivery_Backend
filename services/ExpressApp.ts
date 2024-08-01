import bodyParser from "body-parser";
import express, { Application } from "express";
import path from "path";

import { AdminRoute, ShoppingRoute, VendorRoute } from "../routes";

export default async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // to acces the image folder from the server
  app.use("/images", express.static(path.join(__dirname, "images")));

  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);
  app.use("/shop", ShoppingRoute);

  return app;
};
