import express from "express";
import {
  CustomerGetProfile,
  CustomerLogin,
  CustomerRequestOtp,
  CustomerSignup,
  CustomerUpdateProfile,
  CustomerVerifyAccount,
} from "../controllers";

const router = express.Router();

/** ------------------- Create Customer ------------------- **/
router.post("/signup", CustomerSignup);

/** ------------------- Login ------------------- **/
router.post("/login", CustomerLogin);

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
