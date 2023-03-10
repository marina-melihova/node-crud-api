import { IncomingMessage, ServerResponse } from 'http';
import { UserService } from './userService';
import { UserController } from './userController';
import { getReqType } from '../services';
import { HttpStatusCode } from '../constants';

const userService = new UserService();
const userController = new UserController(userService);
export const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Content-Type', 'application/json');
  let result;
  let statusCode = 200;
  try {
    const reqType = getReqType(req);
    switch (reqType) {
      case 'getUsers':
        return userController.getUsers(res);
      case 'getUserById':
        return userController.getUserById(req, res);
      case 'postUser':
        return await userController.createUser(req, res);
      case 'putUser':
        return await userController.updateUser(req, res);
      case 'deleteUser':
        return userController.deleteUser(req, res);
      default:
        statusCode = HttpStatusCode.NOT_FOUND;
        result = { message: 'Route not found' };
    }
  } catch (err: any) {
    statusCode = err.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
    result = { message: err.message };
  }
  res.writeHead(statusCode);
  return res.end(JSON.stringify(result));
};
