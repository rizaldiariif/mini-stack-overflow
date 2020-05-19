import { Request, Response } from "express";

import { NotFoundError } from "../errors/not-found-error";

import { Question } from "../models/question";
import { Answer } from "../models/answer";

export const create = async (req: Request, res: Response) => {
  const { questionId, content } = req.body;

  const question = await Question.findById(questionId);

  if (!question) {
    throw new NotFoundError();
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
  const answers = await Answer.find();

  res.send(answers);
};
