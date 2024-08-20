// Generate OTP
import dotenv from "dotenv";

dotenv.config();

export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.API_KEY;
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: "Your OTP is " + otp,
    from: process.env.PHONE_NUMBER,
    to: "+213" + toPhoneNumber,
  });

  return response;
};
