import AWS from 'aws-sdk';

class Config {
  public NODE_ENV = process.env.NODE_ENV || 'production';
  public logLevel =
    process.env.NODE_ENV === 'test'
      ? 'silent'
      : process.env.NODE_ENV === 'production'
      ? 'warn'
      : 'debug';
  public PROTOCOL = this.NODE_ENV === 'production' ? 'https' : 'http';
  public ROOT_DOMAIN = process.env.ROOT_DOMAIN;
  public API_DOMAIN = `api.${this.ROOT_DOMAIN}`;
  public CORS_WHITELIST = process.env.CORS_WHITELIST;
  public SENTRY_DSN = process.env.SENTRY_DSN;

  public MAIL_SMTP_SERVER = process.env.MAIL_SMTP_SERVER;
  public MAIL_PASSWORD = process.env.MAIL_PASSWORD;
  public MAIL_NOREPLY_BOX = process.env.MAIL_NOREPLY_BOX;
  public MAIL_INFO_BOX = process.env.MAIL_INFO_BOX;
  public MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  public MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

  // public POSTGRES_HOST = process.env.POSTGRES_HOST;
  // public POSTGRES_DB = process.env.POSTGRES_DB;
  // public POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;

  public s3?: AWS.S3.Types.ClientConfiguration = {
    // https://docs.min.io/docs/how-to-use-aws-sdk-for-javascript-with-minio-server.html
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
    endpoint: `http://${process.env.MINIO_HOST}:${process.env.MINIO_PORT}`,
    s3ForcePathStyle: true, // needed with minio?
    signatureVersion: 'v4',
  };
  public contentPublicURL =
    process.env.CONTENT_PUBLIC_URL || `content.${this.ROOT_DOMAIN}`;

  public IMGPROXY_KEY = process.env.IMGPROXY_KEY;
  public IMGPROXY_SALT = process.env.IMGPROXY_SALT;

  public ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  public ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES;
  public REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  public DESCENTS_TOKEN_SECRET = process.env.DESCENTS_TOKEN_SECRET;

  public GORGE_HOST = process.env.GORGE_HOST || 'gorge.local';
  public GORGE_PORT = process.env.GORGE_PORT || '7080';

  public FB_APP_ID = process.env.FB_APP_ID;
  public FB_SECRET = process.env.FB_SECRET;
}

const config = new Config();

export default config;
