import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { CreateCustomerInputs, customerLoginInputs } from "../dto/Customer.dto";
import { Customer } from "../models";
import { GenerateOtp } from "../utility";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateToken,
  IsPasswordValid,
} from "../utility/PasswordUtility";

export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // The previous way ::
  // const { email, phone, password } = <CreateCustomerInputs>req.body;

  // The New way using "class transformer" ::

  const customerInputs = plainToClass(CreateCustomerInputs, req.body);

  const inputErrors = await validate(customerInputs);

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, password, phone } = customerInputs;

  const salt = await GenerateSalt();

  const customerPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = GenerateOtp();

  const existCustomer = await Customer.findOne({ email: email });
  if (existCustomer !== null) {
    return res.status(400).json({ message: "User exists" });
  }

  const result = await Customer.create({
    email: email,
    password: customerPassword,
    salt: salt,
    firstName: "",
    lastName: "",
    address: "",
    phone: phone,
    verified: false,
    otp: otp,
    otp_expiry: expiry,
    lat: 0,
    lng: 0,
  });

  if (result) {
    // Send OTP to customer "Not working"
    // await onRequestOtp(otp, phone);

    // Generate token
    const signature = GenerateToken({
      _id: result.id,
      verified: result.verified,
      email: result.email,
    });

    // Send the result to the client

    return res.status(200).json({
      signature: signature,
      verified: result.verified,
      email: result.email,
    });
  }

  return res.status(400).json({ message: "Error with Signup" });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(customerLoginInputs, req.body);
  const inputsErrors = await validate(loginInputs);

  if (inputsErrors.length > 0) {
    return res.status(400).json(inputsErrors);
  }

  const { email, password } = loginInputs;

  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const validation = await IsPasswordValid(
      password,
      customer.password,
      customer.salt
    );

    if (validation) {
      const signature = GenerateToken({
        _id: customer.id,
        verified: customer.verified,
        email: customer.email,
      });

      return res.status(200).json({
        signature: signature,
        verified: customer.verified,
        email: customer.email,
      });
    }
  }
  return res.status(400).json({ message: "Error with Login" });
};

export const CustomerVerifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry <= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        // Generate token
        const signature = GenerateToken({
          _id: updatedCustomerResponse.id,
          verified: updatedCustomerResponse.verified,
          email: updatedCustomerResponse.email,
        });

        return res.status(200).json({
          signature: signature,
          verified: updatedCustomerResponse.verified,
          email: updatedCustomerResponse.email,
        });
      }
    }
  }
  return res.status(400).json({ message: "Error with Otp validation" });
};

export const CustomerRequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expiry } = GenerateOtp();

      profile.otp = otp;
      profile.otp_expiry = expiry;

      const updatedCustomer = await profile.save();
      // await onRequestOtp(otp, profile.phone);

      res.status(200).json({
        message: "Otp send to you number",
      });
    }
  }
  return res.status(400).json({ message: "Error with Otp validation" });
};

export const CustomerGetProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      res.status(200).json({
        data: profile,
      });
    }
  }
};
export const CustomerUpdateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
