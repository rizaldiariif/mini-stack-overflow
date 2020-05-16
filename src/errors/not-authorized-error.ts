import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  message = "Not authorized.";

  constructor() {
    super("Not authorized.");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeError() {
    return [{ message: this.message }];
  }
}
