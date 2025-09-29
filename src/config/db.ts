// src/config/db.ts

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface DbPoolConfig {
  poolMin: number;   // not used by mysql2, but we can keep for compatibility
  poolMax: number;   // maps to connectionLimit
  poolIncrement: number; // not used by mysql2
  poolTimeout: number;   // optional: idle timeout (sec)
}

const connection: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
};

const pool: DbPoolConfig = {
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,   // unused in mysql2, safe to ignore
  poolTimeout: 60,
};

export const dbConfig = {
  connection,
  pool,
};
