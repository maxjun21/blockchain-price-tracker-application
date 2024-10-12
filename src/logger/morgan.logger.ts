import * as morgan from 'morgan';
import { createWriteStream } from 'fs';
import { join } from 'path';

const accessLogStream = createWriteStream(join(__dirname, 'access.log'), {
  flags: 'a',
});

const morganMiddleware = morgan('combined', { stream: accessLogStream });

export default morganMiddleware;
