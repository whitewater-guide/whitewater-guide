import { Client } from 'minio';

export const minioClient = new Client({
  endPoint: process.env.MINIO_HOST!,
  port: 9000,
  secure: false,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});
