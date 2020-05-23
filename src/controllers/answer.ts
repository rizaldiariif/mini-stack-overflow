import { Request, Response } from "express";

import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { NotAuthorizedError } from "../errors/not-authorized-error";

import { Question } from "../models/question";
import { Answer } from "../models/answer";

export const getAll = async (req: Request, res: Response) => {
  res.send(res.advancedResults);
};

export const getById = async (req: Request, res: Response) => {
  const answer = await Answer.findById(req.params.id).populate("user");

  res.send(answer);
};

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

export const update = async (req: Request, res: Response) => {
  const answer = await Answer.findById(req.params.id).populate("user");

  if (!answer) {
    throw new NotFoundError();
  }

  if (answer.user.id !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  answer.set({
    content: req.body.content,
  });

  await answer.save();

  res.send(answer);
};
