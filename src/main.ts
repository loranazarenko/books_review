import app from './app';
import {connectDB} from './config/database.connection';
import {useEnv} from './config/useEnv';

const {PORT, HOST} = useEnv();

async function start(): Promise<void> {
    try {
        await connectDB();
        console.log('✔ Connected to MongoDB');

        app.listen(PORT, HOST, () => {
            console.log(`✔ Review Service running at http://${HOST}:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start service:', error);
        process.exit(1);
    }
}

start();