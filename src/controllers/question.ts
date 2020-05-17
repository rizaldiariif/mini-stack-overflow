import { Request, Response } from "express";

import { Question } from "../models/question";

import { NotFoundError } from "../errors/not-found-error";
import { NotAuthorizedError } from "../errors/not-authorized-error";

export const create = async (req: Request, res: Response) => {
  const { title, description } = req.body;

  const question = Question.build({
    title,
    description,
    userId: req.currentUser!.id,
  });

  await question.save();

  res.status(201).send(question);
};

export const getAll = async (req: Request, res: Response) => {
  const questions = await Question.find();

  res.send(questions);
};

export const getById = async (req: Request, res: Response) => {
  const question = await Question.findById(req.params.id);

  res.send(question);
};

export const update = async (req: Request, res: Response) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    throw new NotFoundError();
  }

  if (question.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  question.set({
    title: req.body.title,
    description: req.body.description,
  });

  await question.save();

  res.send(question);
};
