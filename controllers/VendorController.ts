import { NextFunction, Request, Response } from "express";
import { VendorLoginInputs, VendorUpdateInputs } from "../dto";
import { GenerateToken, IsPasswordValid } from "../utility/PasswordUtility";
import { FindVendor } from "./AdminController";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInputs>req.body;

  const vendor = await FindVendor("", email);

  if (vendor !== null) {
    const validation = await IsPasswordValid(
      password,
      vendor.password,
      vendor.salt
    );

    if (validation) {
      const token = GenerateToken({
        _id: vendor.id,
        email: vendor.email,
        foodType: vendor.foodType,
        name: vendor.name,
      });
      return res.json({
        message: "Auth successfully",
        token: token,
        vendor: vendor,
      });
    } else {
      return res.json({ error: "Auth Failed password incorrect" });
    }
  }

  return res.json({ error: "Auth Failed" });
};

export const GetProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);

    return res.json(existingVendor);
  }

  return res.json({ error: "Vendor not found" });
};

export const UpdateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, phone, address, foodType } = <VendorUpdateInputs>req.body;
  const user = req.body.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);

    if (existingVendor) {
      existingVendor.name = name;
      existingVendor.phone = phone;
      existingVendor.address = address;
      existingVendor.foodType = foodType;

      const saveResult = await existingVendor.save();

      res.json({ message: "Vendor updated", result: saveResult });
    }
    return res.json({ error: existingVendor });
  }

  return res.json({ error: "Vendor not found" });
};

export const UpdateService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

      const result = await existingVendor.save();
      return res.json({ message: "Service updated", result: result });
    }
    return res.json({ error: existingVendor });
  }
  return res.json({ error: "Vendor not found" });
};
