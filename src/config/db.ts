// Minimal DB config: just typed shapes and values sourced from env

export interface DatabaseConfig {
  user: string;
  password: string;
  connectString: string;
}

export interface DbPoolConfig {
  poolMin: number;
  poolMax: number;
  poolIncrement: number;
  poolTimeout: number;
}

const connection: DatabaseConfig = {
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  connectString: process.env.DB_CONNECTION_STRING || '',
};

const pool: DbPoolConfig = {
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 1,
  poolTimeout: 60,
};

export const dbConfig = {
  connection,
  pool,
};
