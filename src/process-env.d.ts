declare namespace NodeJS {
  interface ProcessEnv {
    // API
    NODE_ENV: 'local' | 'development' | 'staging' | 'production' | 'ci';
    PROTOCOL: string;
    HOST: string;
    PORT: string;
    LOGGING_LEVEL: 'error' | 'warn' | 'verbose' | 'info' | 'debug';
    CORS_WHITE_LIST: string;
    FRONTEND_URL: string;
    JWT_PRIVATE_KEY: string;
    ADMIN_AUTH_TOKEN: string;
    EMAIL_VERIFICATION_TOKEN_SECRET: string;
    PASSWORD_RESET_TOKEN: string;
    ENV_NAMESPACE: 'stagging' | 'dev' | 'qa' | 'production';
    PROGRESS_REPORT_SECRET: string;
    BUILD_ID: string;
    ADMIN_PANEL_URL: string;

    // Postgres Database envs
    POSTGRES_MIGRATION_PATH: string;
    POSTGRES_PORT: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTRGRES_HOSTNAME: string;

    // Mailer envs
    MAILHOG_CLIENT_PORT: string;
    SMTP_PORT: string;
    MAILHOG_HOST: string;
    SERVICE_MAIL: string;
    ADMIN_EMAIL: string;
  }
}
