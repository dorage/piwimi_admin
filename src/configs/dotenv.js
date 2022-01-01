import dotenv from 'dotenv';
import path from 'path';
import { MODE } from './enum';

// dotenv setting
let loadedDotEnv;

switch (process.env.NODE_ENV) {
    case MODE.DEVELOPMENT:
        loadedDotEnv = dotenv.config({
            path: path.join(__dirname, '../../.env.development'),
        });
        break;
    case MODE.PRODUCTION:
        loadedDotEnv = dotenv.config({
            path: path.join(__dirname, '../../.env.production'),
        });
        break;
    default:
        throw new Error('process.env.NODE_ENV 가 설정되지 않았습니다.');
}
if (loadedDotEnv.error) {
    throw loadedDotEnv.error;
}
