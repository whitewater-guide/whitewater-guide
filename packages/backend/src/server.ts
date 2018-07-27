import db from '@db';
import log from '@log';
import httpShutdown from 'http-shutdown';
import app from './app';

const PORT = Number(process.env.PORT) || 3333;
const HOST = process.env.HOSTNAME || '0.0.0.0';

export default function startServer() {
  const server = httpShutdown(app.listen(PORT, HOST, () => {
    log.info(`Example app listening on port ${PORT}!`);
  }));

  interface Options {
    cleanup?: boolean;
    exit?: boolean;
  }

  // Graceful shutdown: https://stackoverflow.com/a/14032965/6212547
  function gracefulShutdown({ cleanup, exit }: Options, error: any) {
    if (cleanup) {
      server.shutdown();
      db(true).destroy();
    }
    if (error) {
      log.error(error);
    }
    if (exit) {
      process.exit();
    }
  }

  process.on('exit', gracefulShutdown.bind(null, { cleanup: true }));
  process.on('SIGINT', gracefulShutdown.bind(null, { exit: true }));
  process.on('SIGTERM', gracefulShutdown.bind(null, { exit: true }));
  process.on('uncaughtException', gracefulShutdown.bind(null, { exit: true }));
}
