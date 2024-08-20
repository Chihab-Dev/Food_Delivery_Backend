import { NextFunction, Request, Response } from "express";
import { foodDocs, vendor } from "../models";

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // pincode means a code for a specific location
  const pincode = req.params.pincode;

  const result = await vendor
    .find({ pincode: pincode })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: "Data not found" });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  try {
    const result = await vendor
      .find({ pincode: pincode, serviceAvailable: true })
      .sort([["rating", "descending"]])
      .limit(10);
    if (result.length > 0) {
      return res.status(200).json({
        topRestaurants: result,
      });
    }

    return res.status(404).json({ message: "Data not found" });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};

export const GetFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  try {
    const result = await vendor
      .find({ pincode: pincode, serviceAvailable: false })
      .populate("foods");

    if (result.length > 0) {
      let foodResult: any = [];

      result.map((vendor) => {
        const foods = vendor.foods as [foodDocs];

        foodResult.push(...foods.filter((food) => food.readyTime <= 30));
      });

      return res.status(200).json(foodResult);
    }

    return res.status(404).json({ message: "Data not found" });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  try {
    const result = await vendor
      .find({ pincode: pincode, serviceAvailable: true })
      .populate("foods");

    if (result.length > 0) {
      let foodResult: any = [];

      result.map((vendor) => {
        foodResult.push(...vendor.foods);
      });

      return res.status(200).json(foodResult);
    }

    return res.status(404).json({ message: "Data not found" });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};

export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const result = await vendor.findById(id).populate("foods");

  if (result) {
    return res.status(200).json({ restaurant: result });
  }

  return res.status(404).json({ message: "Data not found" });
};
