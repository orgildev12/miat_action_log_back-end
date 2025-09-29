import mysql, {
  Pool,
  PoolConnection,
  PoolOptions,
  RowDataPacket,
  OkPacket,
  ResultSetHeader,
  FieldPacket,
} from 'mysql2/promise';

import { dbConfig, DatabaseConfig } from './src/config/db';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private pool: Pool | null = null;
  private config: DatabaseConfig;

  private constructor() {
    // read-only copy from centralized config
    this.config = { ...dbConfig.connection };
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async initialize(): Promise<void> {
    try {
      this.pool = mysql.createPool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        waitForConnections: true,
        connectionLimit: dbConfig.pool.poolMax || 10,
        queueLimit: 0,
        charset: 'utf8mb4_general_ci', // ✅ proper UTF-8 support
      } as PoolOptions);

      console.log('✅ MySQL Database connection pool created successfully');
    } catch (error) {
      console.error('❌ Error creating MySQL Database connection pool:', error);
      throw error;
    }
  }

  public async executeQuery(
    sql: string,
    binds: any[] = []
  ): Promise<{
    rows: RowDataPacket[] | OkPacket | ResultSetHeader;
    fields: FieldPacket[];
  }> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    let connection: PoolConnection | undefined;
    try {
      connection = await this.pool.getConnection();
      const [rows, fields] = await connection.query<
        RowDataPacket[] | OkPacket | ResultSetHeader
      >(sql, binds);

      return { rows, fields };
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  public async executeMany(
    sql: string,
    binds: any[][]
  ): Promise<ResultSetHeader> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    let connection: PoolConnection | undefined;
    try {
      connection = await this.pool.getConnection();
      await connection.beginTransaction();

      let result: ResultSetHeader = { affectedRows: 0, insertId: 0, warningStatus: 0 } as ResultSetHeader;

      for (const bind of binds) {
        const [res] = await connection.query<ResultSetHeader>(sql, bind);
        result.affectedRows += res.affectedRows;
        if (res.insertId > 0) {
          result.insertId = res.insertId; // last insert ID
        }
      }

      await connection.commit();
      return result;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      console.error('Database executeMany error:', error);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.executeQuery('SELECT NOW() as now');
      console.log('✅ Database connection test successful:', result.rows);
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      return false;
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      try {
        await this.pool.end();
        console.log('✅ Database pool closed successfully');
      } catch (error) {
        console.error('❌ Error closing database pool:', error);
        throw error;
      }
    }
  }
}

// Export singleton instance
export const dbManager = DatabaseManager.getInstance();
