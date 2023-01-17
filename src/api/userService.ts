import { v4 as uuidv4 } from 'uuid';
import { User, UserBody, usersCollection } from './userModel';

export class UserService {
  getUsers = () => usersCollection;

  getUserById = (id: string) => usersCollection.find((user: User) => user.id === id);

  createUser = (userData: UserBody) => {
    const createdUser = {
      id: uuidv4(),
      ...userData,
    };
    usersCollection.push(createdUser);
    return createdUser;
  };

  updateUser = (newUser: User) => {
    const userId = newUser.id;
    const userIdx = usersCollection.findIndex(user => user.id === userId);
    usersCollection[userIdx] = newUser;
  };

  deleteUser = (userId: string) => {
    const userIdx = usersCollection.findIndex(user => user.id === userId);
    usersCollection.splice(userIdx, 1);
  };
}
