import { config as dotenvConfig } from 'dotenv';

interface AppEnv {
  PORT: number;
  HOST: string;
  MONGO_ADDRESS: string;
  BOOK_SERVICE_URL: string;
  NODE_ENV: string;
}

export function useEnv(): AppEnv {
  dotenvConfig();

  const {
    PORT = '3001',
    HOST = 'localhost',
    MONGO_ADDRESS = 'mongodb://localhost:27017/reviewDb',
    BOOK_SERVICE_URL = 'http://localhost:8081',
    NODE_ENV = 'development',
  } = process.env;

  return {
    PORT: parseInt(PORT, 10),
    HOST,
    MONGO_ADDRESS,
    BOOK_SERVICE_URL,
    NODE_ENV,
  };
}