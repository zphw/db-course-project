import dotenv from 'dotenv';
import { cleanEnv, port, str } from 'envalid';

dotenv.config();

export default cleanEnv(process.env, {
    PORT: port({ default: 3000 }),
    DB_HOST: str({ default: 'localhost' }),
    DB_PORT: port({ default: 3306 }),
    DB_USERNAME: str(),
    DB_PASSWORD: str(),
    DB_DATABASE: str(),
    JWT_SECRET: str({ default: 's3cr3t' }),
});
