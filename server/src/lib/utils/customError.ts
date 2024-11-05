export class CustomError extends Error {
  public statusCode: number;
  public errorAlert: boolean;

  constructor(message: string, statusCode = 500, errorAlert = true) {
    super(message);
    this.statusCode = statusCode;
    this.errorAlert = errorAlert;
  }
}
