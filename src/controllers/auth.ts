import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errors/bad-request-error";
import { PasswordClient } from "../services/password-client";

import { User } from "../models/user";

const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    throw new BadRequestError("Email is already taken");
  }

  const user = User.build({ email, password });
  await user.save();

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_KEY!
  );

  // Assign token to session
  req.session = { jwt: token };

  res.status(201).send(user);
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email: email });

  if (!existingUser) {
    throw new BadRequestError("Invalid credentials.");
  }

  const passwordMatch = await PasswordClient.compare(
    existingUser.password,
    password
  );

  if (!passwordMatch) {
    throw new BadRequestError("Invalid credentials.");
  }

  // Generate token
  const token = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    process.env.JWT_KEY!
  );

  // Assign token to session
  req.session = { jwt: token };

  res.status(200).send(existingUser);
};

export { signup, signin };
