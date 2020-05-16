import mongoose from "mongoose";

interface QuestionAttrs {
  title: string;
  description: string;
  userId: string;
}

interface QuestionDoc extends mongoose.Document {
  title: string;
  description: string;
  userId: string;
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
    userId: {
      type: String,
      required: true,
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

questionSchema.statics.build = (attrs: QuestionAttrs) => {
  return new Question(attrs);
};

const Question = mongoose.model<QuestionDoc, QuestionModel>(
  "Question",
  questionSchema
);

export { Question };
