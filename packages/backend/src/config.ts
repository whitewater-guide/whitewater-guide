/* eslint-disable node/no-process-env */
import { S3ClientConfig } from '@aws-sdk/client-s3';
import { readJSON } from 'fs-extra';

class Config {
  private _googleServiceAccount: any;

  public NODE_ENV = process.env.NODE_ENV || 'production';

  public logLevel =
    process.env.NODE_ENV === 'test'
      ? 'silent'
      : process.env.NODE_ENV === 'production'
      ? 'info'
      : 'debug';

  public PROTOCOL = this.NODE_ENV === 'production' ? 'https' : 'http';

  public ROOT_DOMAIN = process.env.ROOT_DOMAIN;

  public API_DOMAIN = `api.${this.ROOT_DOMAIN}`;

  public DEEP_LINKING_DOMAIN = `app.${this.ROOT_DOMAIN}`;

  public CORS_WHITELIST = process.env.CORS_WHITELIST?.split(',') || [];

  public SENTRY_DSN = process.env.SENTRY_DSN;

  public MAIL_SMTP_SERVER = process.env.MAIL_SMTP_SERVER;

  public MAIL_PASSWORD = process.env.MAIL_PASSWORD;

  public MAIL_NOREPLY_BOX = process.env.MAIL_NOREPLY_BOX;

  public MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;

  public MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

  public s3?: S3ClientConfig =
    process.env.NODE_ENV === 'production'
      ? undefined
      : {
          credentials: {
            accessKeyId: process.env.MINIO_ACCESS_KEY!,
            secretAccessKey: process.env.MINIO_SECRET_KEY!,
          },
          // https://docs.min.io/docs/how-to-use-aws-sdk-for-javascript-with-minio-server.html
          endpoint: `http://${process.env.MINIO_HOST}:${process.env.MINIO_PORT}`,
          forcePathStyle: true, // needed with minio?
          // signatureVersion: 'v4',
        };

  public contentPublicURL =
    process.env.CONTENT_PUBLIC_URL || `https://content.${this.ROOT_DOMAIN}`;

  public IMGPROXY_KEY = process.env.IMGPROXY_KEY;

  public IMGPROXY_SALT = process.env.IMGPROXY_SALT;

  public ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

  public ACCESS_TOKEN_EXPIRES = this.NODE_ENV === 'production' ? 1800 : 60;

  public REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

  public DESCENTS_TOKEN_SECRET = process.env.DESCENTS_TOKEN_SECRET;

  public GORGE_HOST = process.env.GORGE_HOST || 'gorge.local';

  public GORGE_PORT = process.env.GORGE_PORT || '7080';

  /**
   * Emails where we send notifications when gorge scripts are unhealthy.
   */
  public GORGE_HEALTH_EMAILS = (process.env.GORGE_HEALTH_EMAILS ?? '')
    .split(',')
    .filter((s) => !!s);

  /**
   * API key header to verify that gorge health webhook calls are valid
   */
  public GORGE_HEALTH_KEY = process.env.GORGE_HEALTH_KEY;

  /**
   * Gorge health webhook calls should have valid host header (port is stripped)
   */
  public GORGE_HEALTH_HOSTS = (process.env.GORGE_HEALTH_HOSTS ?? '')
    .split(',')
    .filter((s) => !!s)
    .concat('api.local');

  public FB_APP_ID = process.env.FB_APP_ID;

  public FB_SECRET = process.env.FB_SECRET;

  public async getGoogleServiceAccount() {
    if (!this._googleServiceAccount) {
      if (process.env.GOOGLE_SERVICE_ACCOUNT) {
        this._googleServiceAccount = JSON.parse(
          process.env.GOOGLE_SERVICE_ACCOUNT,
        );
      } else {
        this._googleServiceAccount = await readJSON(
          'google_service_account.json',
        );
      }
    }
    return this._googleServiceAccount;
  }
}

const config = new Config();

export default config;
