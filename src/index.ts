import { server } from './server';
import { PORT } from './constants';

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
