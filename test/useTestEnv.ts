import {config as dotenvConfig} from 'dotenv';

export function useTestEnv(): {
    MONGO_IMAGE: string;
    MONGO_DB: string;
    MONGO_PORT: string;
} {
    dotenvConfig({path: '.env.test'});

    const {MONGO_PORT = '27017', MONGO_IMAGE = 'mongo:8.0.4', MONGO_DB = 'testDb'} = process.env;

    return {
        MONGO_IMAGE,
        MONGO_DB,
        MONGO_PORT,
    };
}
