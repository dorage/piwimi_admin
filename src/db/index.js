import { Pool } from 'pg';
import { ENV } from '../configs';

const connectionString = ENV.databaseURL;

const pool = new Pool({
    connectionString,
});

export const poolQuery = {};

export default pool;
