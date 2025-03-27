// // Usage: throw new ApiError(400, "Invalid email or password", [{ field: "email", message: "Invalid email" }]);
class ApiError extends Error {
  constructor(statusCode, message, error = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export { ApiError };
