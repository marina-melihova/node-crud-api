import { usersCollection } from './userModel';
import { UserService } from './userService';
import { IncomingMessage, ServerResponse } from 'http';
import { UserController } from './userController';
import { getReqType } from '../services';
import { HttpStatusCode } from '../constants';

const userService = new UserService(usersCollection);
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
        return userController.createUser(req, res);
      case 'putUser':
        return userController.updateUser(req, res);
      case 'deleteUser':
        return userController.deleteUser(req, res);
      default:
        statusCode = HttpStatusCode.NOT_FOUND;
        result = { message: 'Route not found' };
    }
  } catch (err) {
    statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    result = { message: "An error occured on the web server you're trying to access" };
  }
  res.writeHead(statusCode);
  return res.end(JSON.stringify(result));
};
