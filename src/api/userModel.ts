export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type UserBody = Required<Pick<User, 'username' | 'age' | 'hobbies'>>;

export let usersCollection: User[] = [];

export const updateUsers = (collection: User[]) => {
  usersCollection = collection;
};
