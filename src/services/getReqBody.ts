import { IncomingMessage } from 'http';
import { HttpStatusCode } from 'src/constants';
import AppError from './appError';

export const getReqBody = async (req: IncomingMessage) => {
  let rawBody = '';
  for await (const chunk of req) {
    rawBody += chunk.toString();
  }
  try {
    const body = rawBody ? JSON.parse(rawBody) : {};
    return body;
  } catch {
    throw new AppError('Userdata is invalid', HttpStatusCode.BAD_REQUEST);
  }
};
