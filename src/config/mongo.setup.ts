import {GenericContainer} from 'testcontainers';
import mongoose from 'mongoose';
import {config as dotenvConfig} from 'dotenv';

let container: any = null;

export async function startMongoContainer(): Promise<void> {
    dotenvConfig({path: '.env.test'});

    const {MONGO_PORT = '27017', MONGO_IMAGE = 'mongo:8.0.4', MONGO_DB = 'testDb'} = process.env;

    console.log(`Starting MongoDB container (${MONGO_IMAGE})...`);

    try {
        container = await new GenericContainer(MONGO_IMAGE)
            .withExposedPorts(parseInt(MONGO_PORT, 10))
            .start();

        const host = container.getHost();
        const port = container.getMappedPort(parseInt(MONGO_PORT, 10));
        const mongoUri = `mongodb://${host}:${port}/${MONGO_DB}`;

        console.log(`Connecting to MongoDB at ${mongoUri}`);
        await mongoose.connect(mongoUri);

        console.log('✔ MongoDB container started and connected');
    } catch (error) {
        console.error('❌ Failed to start MongoDB container:', error);
        throw error;
    }
}

export async function stopMongoContainer(): Promise<void> {
    console.log('Stopping MongoDB container...');

    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        if (container) {
            await container.stop();
        }

        console.log('✔ MongoDB container stopped');
    } catch (error) {
        console.error('❌ Failed to stop MongoDB container:', error);
    }
}

export async function clearDatabase(): Promise<void> {
    if (!mongoose.connection.db) {
        throw new Error('Database connection is not established');
    }

    console.log('Clearing database...');
    await mongoose.connection.db.dropDatabase();
    console.log('✔ Database cleared');
}
