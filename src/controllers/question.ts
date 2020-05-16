import { Request, Response } from "express";

import { Question } from "../models/question";

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
