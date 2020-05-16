import express from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";

import { signup, signin } from "../controllers/auth";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
      .trim()
      .isLength({ min: 4, max: 50 })
      .withMessage("Password must be between 4 and 50 characters."),
  ],
  validateRequest,
  signup
);

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password").trim().notEmpty().withMessage("Password must be valid."),
  ],
  validateRequest,
  signin
);

export { router as authRouter };
