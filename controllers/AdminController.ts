import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility/PasswordUtility";

export const FindVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await vendor.findOne({ email: email });
  } else {
    return await vendor.findById(id);
  }
};

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

  const existingVendor = await FindVendor("", email);

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
    coverImages: [],
    foods: [],
  });

  return res.json(createdVendor);
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await vendor.find();

  if (vendors !== null) {
    return res.json({
      count: vendors.length,
      vendors: vendors,
    });
  }

  return res.json({ error: "No vendors available" });
};

export const GetVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.params.vendorId;

  const vendorData = await FindVendor(vendorId);

  if (vendorData !== null) {
    return res.json(vendorData);
  }

  return res.json({ error: "No vendor available" });
};
