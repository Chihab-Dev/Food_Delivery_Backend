import express from "express";
import { CreateVendor, GetVendorById, GetVendors } from "../controllers";

const router = express.Router();

router.post("/createVendor", CreateVendor);
router.get("/vendors", GetVendors);
router.get("/vendors/:vendorId", GetVendorById);

router.get("/", (req, res) => {
  res.json({ message: "response from admin" });
});

export { router as AdminRoute };
