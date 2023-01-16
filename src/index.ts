import 'dotenv/config';
import http from 'http';
import cluster from 'cluster';
import os from 'os';
import { pipeline } from 'stream/promises';
import { User, usersCollection, updateUsers } from './api/userModel';
import { handleRequest } from './api/userRouter';
import { server } from './server';
import { HttpStatusCode } from './constants';

const PORT = +process.env.PORT || 4000;
const environment = process.env.NODE_ENV;

if (environment === 'multi') {
  if (cluster.isPrimary) {
    let portIdx = 0;
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork({ WORKER_PORT: PORT + i + 1 });
    }

    const primaryServer = http.createServer(async (req, res) => {
      const url = `http://localhost:${PORT + portIdx + 1}${req.url}`;
      const reqOptions: http.RequestOptions = {
        method: req.method,
        headers: req.headers,
      };

      const workerReq = http.request(url, reqOptions, async resp => {
        res.writeHead(+resp.statusCode, { 'Content-Type': 'application/json' });
        await pipeline(resp, res);
      });

      workerReq.on('error', error => {
        res.writeHead(HttpStatusCode.INTERNAL_SERVER_ERROR);
        return res.end(JSON.stringify({ message: 'An error has occurred during connection to the server' }));
      });

      await pipeline(req, workerReq);
      portIdx = (portIdx + 1) % numCPUs;
    });

    primaryServer.listen(PORT, () => {
      console.log(`Primary ${process.pid} started on ${PORT}`);
    });
  } else {
    const workerPort = +process.env.WORKER_PORT;
    const serverWorker = http.createServer(async (req, res) => {
      await handleRequest(req, res);
      cluster.worker.send({ users: usersCollection });
      console.log(`Worker pid=${String(cluster.worker.id)} (pid=${process.pid}) returned response on request`);
    });

    serverWorker.listen(workerPort, () => {
      console.log(`Worker pid=${process.pid} started on http://localhost:${workerPort}`);
    });
  }

  cluster.on('message', (worker, message: { users: User[] }) => {
    updateUsers(message.users);
    const workers = Object.values(cluster.workers);
    workers.forEach(worker => {
      worker.send(message);
    });
  });

  cluster.on('listening', (worker, address) => {
    console.log(`Worker ${worker.id} (pid=${worker.process.pid}) is now connected to http://localhost:${address.port}`);
  });

  process.on('message', (message: { users: User[] }) => {
    updateUsers(message.users);
  });
} else {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}
