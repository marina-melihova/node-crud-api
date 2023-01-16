import { HttpStatusCode } from 'src/constants';
class AppError extends Error {
  isOperational: boolean;
  status: number;
  constructor(message: string, status = HttpStatusCode.INTERNAL_SERVER_ERROR) {
    super(message);
    this.status = status;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', (err: any) => {
  console.log(err.toString());
  if (!err.isOperational) {
    process.exit(1);
  }
});

export default AppError;
