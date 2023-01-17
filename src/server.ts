import http from 'http';
import { handleRequest } from './api/userRouter';

export const server = http.createServer(handleRequest);
