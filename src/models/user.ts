import mongoose from "mongoose";
import { PasswordClient } from "../services/password-client";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordClient.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attributes: UserAttrs) => {
  return new User(attributes);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
