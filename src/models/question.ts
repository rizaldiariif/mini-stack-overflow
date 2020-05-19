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
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

questionSchema.pre("findOne", function (next) {
  this.populate("user");
  next();
});

questionSchema.pre("find", function (next) {
  this.populate("user");
  next();
});

questionSchema.statics.build = (attrs: QuestionAttrs) => {
  return new Question(attrs);
};

const Question = mongoose.model<QuestionDoc, QuestionModel>(
  "Question",
  questionSchema
);

export { Question };
