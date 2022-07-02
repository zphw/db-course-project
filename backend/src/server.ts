import http from 'http';
import app from './app';
import env from './utils/env';
import logger from './utils/logger';

const port = env.PORT;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

server.on('listening', () => {
    logger.info(`Listening on ${port}`);
});