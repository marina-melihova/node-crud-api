import { IncomingMessage } from 'http';
import { HttpMethod, USERS_ENDPOINT } from '../constants';

export const getReqType = (req: IncomingMessage) => {
  if (req.url === USERS_ENDPOINT) {
    switch (req.method) {
      case HttpMethod.GET:
        return 'getUsers';
      case HttpMethod.POST:
        return 'postUser';
    }
  }

  if (req.url?.startsWith(USERS_ENDPOINT)) {
    switch (req.method) {
      case HttpMethod.GET:
        return 'getUserById';
      case HttpMethod.PUT:
        return 'putUser';
      case HttpMethod.DELETE:
        return 'deleteUser';
    }
  }

  return 'uknown';
};
