const axios = require('axios');

axios.get(`http://${process.env.MINIO_HOST}:9000/minio/health/live`)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
