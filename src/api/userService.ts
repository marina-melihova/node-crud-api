import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { User, UserBody, updateUsers } from './userModel';

export class UserService {
  users: User[];

  constructor(users: User[]) {
    this.users = users;
  }

  getUsers = async () => {
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
  };

  updateUser = (newUser: User) => {
    const userId = newUser.id;
    updateUsers(this.users.map(user => (user.id === userId ? newUser : user)));
  };

  deleteUser = (userId: string) => {
    updateUsers(this.users.filter(user => user.id !== userId));
  };
}
