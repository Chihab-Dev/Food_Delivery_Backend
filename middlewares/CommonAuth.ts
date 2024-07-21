import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { ValidateToken } from "../utility/PasswordUtility";

declare global {
  namespace Express {
    interface request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = await ValidateToken(req);

  if (validation) {
    next();
  } else {
    return res.json({ error: "Validation token error " });
  }
};
