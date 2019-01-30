const axios = require('axios');

axios
  .get(
    `http://${process.env.MINIO_HOST}:${
      process.env.MINIO_PORT
    }/minio/health/live`,
  )
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
