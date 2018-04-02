const {
  WORKERS_HOST,
  WORKERS_PORT,
  WORKERS_ENDPOINT: EP,
} = process.env;

export const WORKERS_ENDPOINT = `http://${WORKERS_HOST}:${WORKERS_PORT}${EP}`;