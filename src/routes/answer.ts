import express from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";
import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";
import { advancedResults } from "../middlewares/advanced-result";

import { Answer } from "../models/answer";

import { getAll, getById, create, update } from "../controllers/answer";

const router = express.Router();

router.get(
  "/",
  advancedResults(Answer, {
    path: "question",
    select: "title description user",
    populate: { path: "user" },
  }),
  getAll
);

router.get("/:id", getById);

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

router.post(
  "/:id",
  currentUser,
  requireAuth,
  [body("content").not().isEmpty().withMessage("Content is required")],
  update
);

export { router as answerRouter };
