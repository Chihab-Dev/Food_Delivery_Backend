import bcrypt from "bcryptjs";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { APP_SECRET_KEY } from "../config";
import { VendorPayload } from "../dto";
import { AuthPayload } from "../dto/Auth.dto";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const IsPasswordValid = async (
  inputPassword: string,
  vendorPassword: string,
  vendorSalt: string
) => {
  return (await GeneratePassword(inputPassword, vendorSalt)) === vendorPassword;
};

export const GenerateToken = (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET_KEY, { expiresIn: "1d" });
};

export const ValidateToken = async (req: Request) => {
  const token = req.headers["authorization"];

  if (token) {
    const payload = jwt.verify(
      token.split(" ")[1],
      APP_SECRET_KEY
    ) as AuthPayload;

    req.user = payload;

    return true;
  }
  return false;
};
