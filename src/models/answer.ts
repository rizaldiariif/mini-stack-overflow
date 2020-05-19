import mongoose from "mongoose";

import { QuestionDoc } from "./question";
import { UserDoc } from "./user";

interface AnswerAttrs {
  content: string;
  question: QuestionDoc;
  user: UserDoc;
}

interface AnswerDoc extends mongoose.Document {
  content: string;
  question: QuestionDoc;
  user: UserDoc;
}

interface AnswerModel extends mongoose.Model<AnswerDoc> {
  build(attrs: AnswerAttrs): AnswerDoc;
}

const answerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

answerSchema.pre("findOne", function (next) {
  this.populate("question");
  this.populate("user");
  next();
});

answerSchema.pre("find", function (next) {
  this.populate("question");
  this.populate("user");
  next();
});

answerSchema.statics.build = (attrs: AnswerAttrs) => {
  return new Answer(attrs);
};

const Answer = mongoose.model<AnswerDoc, AnswerModel>("Answer", answerSchema);

export { Answer };
