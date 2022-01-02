import './dotenv';
import './googleCloudStorage';
import { MODE } from './enum';

// type casting fns
const number = (value) => {
    const result = Number(value);
    if (!Number.isNaN(result)) return result;
};
const string = (value) => value;

const typeConverter = { string, number };

const cast = (key, type, defaultValue) => {
    const value = process.env[key];
    if (value !== undefined) {
        const result = typeConverter[type](value);
        if (result !== undefined) {
            return result;
        }
        throw new Error(
            `process.env.${key}에 적절한 값이 설정되지 않았습니다.`,
        );
    }
    if (process.env.NODE_ENV === MODE.PRODUCTION) {
        throw new Error(`process.env.${key}에 값이 설정되지 않았습니다.`);
    }
    if (defaultValue !== undefined) {
        return defaultValue;
    }
    throw new Error(`process.env.${key}에 할당할 값이 없습니다.`);
};

export const ENV = {
    nodeEnv: cast('NODE_ENV', 'string', MODE.DEVELOPMENT),
    port: cast('PORT', 'number', '4000'),
    cookieSecret: cast('COOKIE_SECRET', 'string', 'psychotest'),
    databaseURL: cast(
        'DATABASE_URL',
        'string',
        'postgresql://postgres:admin@localhost:5432/piwimiv2',
    ),
    gcsBucketName: cast('GCS_BUCKET_NAME', 'string', 'pwm-local'),
};
