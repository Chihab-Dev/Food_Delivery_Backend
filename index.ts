import express from "express";
import dbConnection from "./services/Database";
import App from "./services/ExpressApp";

const startServer = async () => {
  const app = express();

  await dbConnection();

  await App(app);

  app.listen(8000, () => {
    console.clear();
    console.log("listening to port 8000");
  });
};

startServer();
