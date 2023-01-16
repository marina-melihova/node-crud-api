import supertest from 'supertest';
import { server } from '../src/server';
import { validate as uuidValidate } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { afterEach, expect, jest } from '@jest/globals';
import { updateUsers } from '../src/api/userModel';
import 'dotenv/config';
const environment = process.env.NODE_ENV;

console.log(environment);

const newUser = {
  username: 'Maryna',
  age: 27,
  hobbies: ['cooking', 'dancing'],
};
const { username, age, hobbies } = newUser;

afterEach(() => {
  server.close();
  updateUsers([]);
});

describe('GET user(s) test suite', () => {
  it('should return array when request all users', async () => {
    const res = await supertest(server).get('/api/users').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should return user by id when everything is OK', async () => {
    const postResp = await supertest(server).post('/api/users').send(newUser);
    const id = postResp.body.id;
    const getUserByIdResp = await supertest(server).get(`/api/users/${id}`).send();
    expect(getUserByIdResp.statusCode).toEqual(200);
    expect(getUserByIdResp.body).toStrictEqual({ id, ...newUser });
  });

  it('should return 404 when corresponding user not found', async () => {
    const wrongId = uuidv4();
    const getUserByIdResp = await supertest(server).get(`/api/users/${wrongId}`).send();
    expect(getUserByIdResp.statusCode).toEqual(404);
    expect(getUserByIdResp.body.message).toEqual(`User with id ${wrongId} not found`);
  });

  it('should return 400 when request by invalid id', async () => {
    const wrongId = 'fakeId';
    const getUserByIdResp = await supertest(server).get(`/api/users/${wrongId}`).send();
    expect(getUserByIdResp.statusCode).toEqual(400);
    expect(getUserByIdResp.body.message).toEqual(`User id ${wrongId} is invalid`);
  });
});

describe('POST user test suite', () => {
  it('should create a new user when everything is OK', async () => {
    const postResp = await supertest(server).post('/api/users').send(newUser);
    expect(postResp.statusCode).toEqual(201);
    expect(postResp.body.username).toEqual(username);
    expect(postResp.body.age).toEqual(age);
    expect(postResp.body.hobbies).toEqual(hobbies);
    expect(uuidValidate(postResp.body.id)).toBeTruthy;
  });

  it("should return 400 when body doesn't contain required field", async () => {
    const postResp = await supertest(server).post('/api/users').send({ username, age });
    expect(postResp.statusCode).toEqual(400);
    expect(postResp.body.message).toEqual(`hobbies is required in body`);
  });
});

describe('PUT user test suite', () => {
  it('should update user by id when everything is OK', async () => {
    const postResp = await supertest(server).post('/api/users').send(newUser);
    const id = postResp.body.id;
    const updatedUser = {
      username: 'John',
      age: 35,
      hobbies: [],
    };
    const putResp = await supertest(server).put(`/api/users/${id}`).send(updatedUser);
    expect(putResp.statusCode).toEqual(200);
    expect(putResp.body).toStrictEqual({ id, ...updatedUser });
  });

  it('should return 404 when corresponding user not found', async () => {
    const wrongId = uuidv4();
    const putResp = await supertest(server).put(`/api/users/${wrongId}`).send();
    expect(putResp.statusCode).toEqual(404);
    expect(putResp.body.message).toEqual(`User with id ${wrongId} not found`);
  });

  it('should return 400 when request by invalid id', async () => {
    const wrongId = 'fakeId';
    const putResp = await supertest(server).put(`/api/users/${wrongId}`).send();
    expect(putResp.statusCode).toEqual(400);
    expect(putResp.body.message).toEqual(`User id ${wrongId} is invalid`);
  });
});
