import { Request, Response } from "express";

import { BadRequestError } from "../errors/bad-request-error";

import { Question } from "../models/question";
import { Answer } from "../models/answer";

export const create = async (req: Request, res: Response) => {
  const { questionId, content } = req.body;

  const question = await Question.findById(questionId).populate("user");

  if (!question) {
    throw new BadRequestError("questionId is invalid");
  }

  const answer = Answer.build({
    content,
    question,
    user: req.currentUser!,
  });

  answer.save();

  res.send(answer);
};

export const getAll = async (req: Request, res: Response) => {
  const answers = await Answer.find()
    .populate({
      path: "question",
      select: "title description user",
      populate: { path: "user" },
    })
    .populate("user");

  res.send(answers);
};
