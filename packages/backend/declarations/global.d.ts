declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV?: 'production' | 'development' | 'test';
    LOG_LEVEL?:
      | 'fatal'
      | 'error'
      | 'warn'
      | 'info'
      | 'debug'
      | 'trace'
      | 'silent';

    API_DOMAIN: string;
    ROOT_DOMAIN: string;
    PROTOCOL: string;
    CORS_WHITELIST?: string;
    SENTRY_DSN?: string;

    MAIL_SMTP_SERVER: string;
    MAIL_PASSWORD: string;
    MAIL_NOREPLY_BOX: string;
    MAILCHIMP_API_KEY: string;
    MAILCHIMP_LIST_ID: string;

    POSTGRES_HOST: string;
    POSTGRES_DB: string;
    POSTGRES_PASSWORD: string;

    CONTENT_PUBLIC_URL?: string;
    MINIO_ACCESS_KEY?: string;
    MINIO_SECRET_KEY?: string;
    MINIO_HOST?: string;
    MINIO_PORT?: string;

    IMGPROXY_KEY: string;
    IMGPROXY_SALT: string;

    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;

    DESCENTS_TOKEN_SECRET: string;

    GORGE_HOST?: string;
    GORGE_PORT?: string;

    FB_APP_ID: string;
    FB_SECRET: string;

    GOOGLE_SERVICE_ACCOUNT?: string;
  }
}
