import express from "express";
import multer from "multer";
import {
  AddFood,
  GetAllFoods,
  GetVendorProfile,
  UpdateVendorCoverImage,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin,
} from "../controllers";
import { Authenticate } from "../middlewares/CommonAuth";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },

  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", VendorLogin);

router.use(Authenticate);
router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/service", UpdateVendorService);
router.patch("/coverImage", images, UpdateVendorCoverImage);

router.post("/food", images, AddFood);
router.get("/foods", GetAllFoods);

router.get("/", (req, res) => {
  res.json("Hello from vendor route");
});

export { router as VendorRoute };
