import mongoose from "mongoose";

import { UserDoc } from "./user";

interface QuestionAttrs {
  title: string;
  description: string;
  user: UserDoc;
}

export interface QuestionDoc extends mongoose.Document {
  title: string;
  description: string;
  user: UserDoc;
}

interface QuestionModel extends mongoose.Model<QuestionDoc> {
  build(attrs: QuestionAttrs): QuestionDoc;
}

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    id: false,
    toJSON: {
      virtuals: true,
    },
  }
);

questionSchema.virtual("answers", {
  ref: "Answer",
  localField: "_id",
  foreignField: "question",
  justOne: false,
});

questionSchema.statics.build = (attrs: QuestionAttrs) => {
  return new Question(attrs);
};

const Question = mongoose.model<QuestionDoc, QuestionModel>(
  "Question",
  questionSchema
);

export { Question };
