// Generate OTP

export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {
  const accountSid = "AC717ae02dde1ceac37f3d95917f39eab3";
  const authToken = "1dff2eb927f318781b3189df9029224c";
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: "Your OTP is " + otp,
    from: "+13317033113",
    to: "+213" + toPhoneNumber,
  });

  return response;
};
