import { IncomingMessage, ServerResponse } from 'http';
import { validate as uuidValidate } from 'uuid';
import { UserService } from './userService';
import { User, UserBody } from './userModel';
import { getReqBody } from '../services';
import { HttpStatusCode } from '../constants';

export class UserController {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getUsers = (res: ServerResponse) => {
    const users = this.userService.getUsers();
    res.writeHead(HttpStatusCode.OK);
    return res.end(JSON.stringify(users));
  };

  getUserById = (req: IncomingMessage, res: ServerResponse) => {
    const id = String(req.url?.split('/')[3]);
    const isValidUUID = uuidValidate(id);
    if (!isValidUUID) {
      res.writeHead(HttpStatusCode.BAD_REQUEST);
      return res.end(JSON.stringify({ message: `User id ${id} is invalid` }));
    }

    const user = this.userService.getUserById(id);

    if (!user) {
      res.writeHead(HttpStatusCode.NOT_FOUND);
      return res.end(JSON.stringify({ message: `User with id ${id} not found` }));
    }

    res.writeHead(HttpStatusCode.OK);
    return res.end(JSON.stringify(user));
  };

  createUser = async (req: IncomingMessage, res: ServerResponse) => {
    const body = await getReqBody(req);
    let error = '';
    const requiredProps = ['username', 'age', 'hobbies'];
    for (const prop of requiredProps) {
      if (!body.hasOwnProperty(prop)) {
        error = `${prop} is required in body`;
      }
    }
    if (error) {
      res.writeHead(HttpStatusCode.BAD_REQUEST);
      return res.end(JSON.stringify({ message: error }));
    }
    const user = this.userService.createUser(body as UserBody);
    res.writeHead(HttpStatusCode.CREATED);
    return res.end(JSON.stringify(user));
  };

  updateUser = async (req: IncomingMessage, res: ServerResponse) => {
    const id = String(req.url?.split('/')[3]);
    const isValidUUID = uuidValidate(id);

    if (!isValidUUID) {
      res.writeHead(HttpStatusCode.BAD_REQUEST);
      return res.end(JSON.stringify({ message: `User id ${id} is invalid` }));
    }

    const user = this.userService.getUserById(id);

    if (!user) {
      res.writeHead(HttpStatusCode.NOT_FOUND);
      return res.end(JSON.stringify({ message: `User with id ${id} not found` }));
    }
    const body = await getReqBody(req);
    const { id: bodyId, ...userData } = body;
    const updatedUser = { ...user, ...userData } as User;
    this.userService.updateUser(updatedUser);
    res.writeHead(HttpStatusCode.OK);
    return res.end(JSON.stringify(updatedUser));
  };

  deleteUser = (req: IncomingMessage, res: ServerResponse) => {
    const id = String(req.url?.split('/')[3]);
    const isValidUUID = uuidValidate(id);

    if (!isValidUUID) {
      res.writeHead(HttpStatusCode.BAD_REQUEST);
      return res.end(JSON.stringify({ message: `User id ${id} is invalid` }));
    }

    const user = this.userService.getUserById(id);

    if (!user) {
      res.writeHead(HttpStatusCode.NOT_FOUND);
      return res.end(JSON.stringify({ message: `User with id ${id} not found` }));
    }

    this.userService.deleteUser(id);
    res.statusCode = HttpStatusCode.NO_CONTENT;
    return res.end();
  };
}
