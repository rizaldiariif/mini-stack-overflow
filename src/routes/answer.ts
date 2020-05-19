import express from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";
import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";

import { create, getAll } from "../controllers/answer";

const router = express.Router();

router.get("/", getAll);

router.post(
  "/",
  currentUser,
  requireAuth,
  [
    body("content").not().isEmpty().withMessage("Content is required"),
    body("questionId").not().isEmpty().withMessage("questionId is required"),
  ],
  validateRequest,
  create
);

export { router as answerRouter };
