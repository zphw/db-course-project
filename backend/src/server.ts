import http from 'http';

import app from './app';
import env from './utils/env';

const port = env.PORT;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

server.on('listening', () => {
    console.log(`Listening on ${port}`);
});
