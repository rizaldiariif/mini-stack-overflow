import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;
  message = "Route not found.";

  constructor() {
    super("Route not found.");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError() {
    return [{ message: this.message }];
  }
}
