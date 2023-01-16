import { v4 as uuidv4 } from 'uuid';
import { User, UserBody } from './userModel';

export class UserService {
  users: User[];

  constructor(users: User[]) {
    this.users = users;
  }

  getUsers = () => {
    return this.users;
  };

  getUserById = (id: string) => {
    return this.users.find((user: User) => user.id === id);
  };

  createUser = (userData: UserBody) => {
    const createdUser = {
      id: uuidv4(),
      ...userData,
    };
    this.users.push(createdUser);
    return createdUser;
  };

  updateUser = (newUser: User) => {
    const userId = newUser.id;
    const userIdx = this.users.findIndex(user => user.id === userId);
    this.users[userIdx] = newUser;
  };

  deleteUser = (userId: string) => {
    const userIdx = this.users.findIndex(user => user.id === userId);
    this.users.splice(userIdx, 1);
  };
}
