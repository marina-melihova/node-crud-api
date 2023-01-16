import { IncomingMessage } from 'http';

export const getReqBody = async (req: IncomingMessage) => {
  let body = '';
  for await (const chunk of req) {
    body += chunk.toString();
  }
  return body ? JSON.parse(body) : {};
};
