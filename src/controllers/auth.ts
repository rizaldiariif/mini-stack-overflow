import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { BadRequestError } from "../errors/bad-request-error";
import { PasswordClient } from "../services/password-client";

import { User } from "../models/user";

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    throw new BadRequestError("Email is already taken");
  }

  const user = User.build({ email, password });
  await user.save();

  // Generate token
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_KEY!
  );

  // Assign token to session
  req.session = { jwt: token };

  res.status(201).send(user);
};

export const signin = async (req: Request, res: Response) => {
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
    { _id: existingUser.id, email: existingUser.email },
    process.env.JWT_KEY!
  );

  // Assign token to session
  req.session = { jwt: token };

  res.status(200).send(existingUser);
};

export const signout = (req: Request, res: Response) => {
  req.session = null;

  res.send({});
};

export const currentUser = (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
};
