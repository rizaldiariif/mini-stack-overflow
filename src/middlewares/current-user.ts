import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { User, UserDoc } from "../models/user";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDoc;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    const existingUser = await User.findOne({
      _id: payload.id,
      email: payload.email,
    });

    if (existingUser) {
      req.currentUser = existingUser;
    }
  } catch (error) {}

  next();
};
