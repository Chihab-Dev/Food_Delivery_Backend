import express from "express";
import {
  CustomerGetProfile,
  CustomerLogin,
  CustomerRequestOtp,
  CustomerSignup,
  CustomerUpdateProfile,
  CustomerVerifyAccount,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

/** ------------------- Create Customer ------------------- **/
router.post("/signup", CustomerSignup);

/** ------------------- Login ------------------- **/
router.post("/login", CustomerLogin);

// Authentication
router.use(Authenticate);

/** ------------------- Verify customer account ------------------- **/
router.patch("/verify", CustomerVerifyAccount);

/** ------------------- Otp check ------------------- **/
router.get("/otp", CustomerRequestOtp);

/** ------------------- Profile ------------------- **/
router.get("/profile", CustomerGetProfile);

router.patch("/profile", CustomerUpdateProfile);

// Order
// Cart
// Payment

export { router as CustomerRoute };
