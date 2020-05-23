import express from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";
import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";
import { advancedResults } from "../middlewares/advanced-result";

import { Question } from "../models/question";

import { getAll, getById, create, update } from "../controllers/question";

const router = express.Router();

router.get(
  "/",
  advancedResults(Question, {
    path: "answers",
    select: "content user",
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
    body("title").not().isEmpty().withMessage("Title is required"),
    body("description").not().isEmpty().withMessage("Description is required"),
  ],
  validateRequest,
  create
);

router.post(
  "/:id",
  currentUser,
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("description").not().isEmpty().withMessage("Description is required"),
  ],
  validateRequest,
  update
);

export { router as questionRouter };
