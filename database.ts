import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

export interface DatabaseConfig {
  user: string;
  password: string;
  connectString: string;
}

export class DatabaseManager {
  private static instance: DatabaseManager;
  private pool: oracledb.Pool | null = null;
  private config: DatabaseConfig;

  private constructor() {
    this.config = {
      user: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      connectString: process.env.DB_CONNECTION_STRING || ''
    };
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async initialize(): Promise<void> {
    try {
      this.pool = await oracledb.createPool({
        user: this.config.user,
        password: this.config.password,
        connectString: this.config.connectString,
        poolMin: 2,
        poolMax: 10,
        poolIncrement: 1,
        poolTimeout: 60
      });
      
      console.log('✅ Oracle Database connection pool created successfully');
    } catch (error) {
      console.error('❌ Error creating Oracle Database connection pool:', error);
      throw error;
    }
  }

  public async executeQuery<T = any>(
    sql: string, 
    binds: any[] = [], 
    options: oracledb.ExecuteOptions = {}
  ): Promise<oracledb.Result<T>> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    let connection: oracledb.Connection | undefined;
    
    try {
      connection = await this.pool.getConnection();
      
      const defaultOptions: oracledb.ExecuteOptions = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true,
        ...options
      };
      
      const result = await connection.execute<T>(sql, binds, defaultOptions);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error('Error closing connection:', error);
        }
      }
    }
  }

  public async executeMany(
    sql: string,
    binds: any[][],
    options: oracledb.ExecuteManyOptions = {}
  ): Promise<oracledb.Results<any>> {
    if (!this.pool) {
      throw new Error('Database pool not initialized');
    }

    let connection: oracledb.Connection | undefined;
    
    try {
      connection = await this.pool.getConnection();
      
      const defaultOptions: oracledb.ExecuteManyOptions = {
        autoCommit: true,
        ...options
      };
      
      const result = await connection.executeMany(sql, binds, defaultOptions);
      return result;
    } catch (error) {
      console.error('Database executeMany error:', error);
      throw error;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error('Error closing connection:', error);
        }
      }
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.executeQuery('SELECT SYSDATE FROM DUAL');
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
        await this.pool.close();
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
