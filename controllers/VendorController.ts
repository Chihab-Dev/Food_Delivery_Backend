import { NextFunction, Request, Response } from "express";
import { VendorLoginInputs, VendorUpdateInputs } from "../dto";
import { CreateFoodInput } from "../dto/Food.dto";
import { food } from "../models";
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

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);

    return res.json(existingVendor);
  }

  return res.json({ error: "Vendor not found" });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, phone, address, foodType } = <VendorUpdateInputs>req.body;
  const user = req.user;

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

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

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

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);
    
    if (existingVendor) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      existingVendor.coverImages.push(...images);

      const result = await existingVendor.save();

      const response = {
        message: "cover image updated successfully",
        newVendor: result,
      };
      return res.json(response);
    }
    return res.json({ error: existingVendor });
  }
  return res.json({ error: "Vendor not found" });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const vendor = await FindVendor(user._id);
    const foodInputs = <CreateFoodInput>req.body;

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      const imagesNames = files.map(
        (file: Express.Multer.File) => file.filename
      );

      const createdFood = await food.create({
        vendorId: vendor._id,
        name: foodInputs.name,
        description: foodInputs.description,
        category: foodInputs.category,
        foodType: foodInputs.foodType,
        price: foodInputs.price,
        readyTime: foodInputs.readyTime,
        rating: 0,
        images: imagesNames,
      });

      vendor.foods.push(createdFood);
      const result = await vendor.save();

      return res.json({
        message: "Food created successfully",
        food: createdFood,
        vendor: result,
      });
    }
    return res.json({ error: "Vendor not found" });
  }

  return res.json({ error: "User not found" });
};

export const GetAllFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await food.find({ vendorId: user._id });

    if (foods !== null) {
      const response = {
        count: foods.length,
        foods: foods,
      };
      res.json(response);
    }
  }
  return res.json({ errro: "User not found" });
};
