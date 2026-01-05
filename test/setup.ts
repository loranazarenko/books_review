import {startMongoContainer, stopMongoContainer} from '../src/config/mongo.setup';

beforeAll(async () => {
    await startMongoContainer();
}, 60000);

afterAll(async () => {
    await stopMongoContainer();
}, 30000);
