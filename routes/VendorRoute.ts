import express from "express";
import {
  GetProfile,
  UpdateProfile,
  UpdateService,
  VendorLogin,
} from "../controllers";
import { Authenticate } from "../middlewares/CommonAuth";

const router = express.Router();

router.post("/login", VendorLogin);

router.use(Authenticate);
router.get("/profile", GetProfile);
router.patch("/profile", UpdateProfile);
router.patch("/service", UpdateService);

router.get("/", (req, res) => {
  res.json("Hello from vendor route");
});

export { router as VendorRoute };
