import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pkg.Pool({
  user: process.env.DB_USER || 'scriptbook_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'scriptbook',
  password: process.env.DB_PASSWORD || 'scriptbook_password',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production',
});

export default pool;
