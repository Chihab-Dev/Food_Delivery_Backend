import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility/PasswordUtility";

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // The required data ⬇
  const {
    name,
    ownerName,
    foodType,
    pincode,
    address,
    phone,
    email,
    password,
  } = <CreateVendorInput>req.body;

  const existingVendor = await vendor.findOne({ email: email });

  if (existingVendor != null) {
    return res.json({
      error: "Vendor already exists",
    });
  }

  // generate salt
  const salt = await GenerateSalt();

  // generate password
  const CyptedPassword = await GeneratePassword(password, salt);

  const createdVendor = await vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: CyptedPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: 0,
  });

  return res.json(createdVendor);
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const GetVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
