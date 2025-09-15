import oracledb from 'oracledb';
import { dbConfig, DatabaseConfig } from './src/config/db';

// Set Oracle client environment for UTF-8 support for Mongolian/Cyrillic text
process.env.NLS_LANG = 'AMERICAN_AMERICA.AL32UTF8';
process.env.NLS_NCHAR = 'AL32UTF8';

export class DatabaseManager {
  private static instance: DatabaseManager;
  private pool: oracledb.Pool | null = null;
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
      // Configure Oracle client for proper character encoding
      oracledb.fetchAsString = [oracledb.CLOB];
      oracledb.fetchAsBuffer = [oracledb.BLOB];
      
      // Set Oracle client to use UTF-8 for all string operations
      oracledb.stmtCacheSize = 40;
      
      // Initialize Oracle client with UTF-8 support
      try {
        oracledb.initOracleClient({
          libDir: undefined, // Use default Oracle client
        });
      } catch (err) {
        // Client might already be initialized, ignore
        console.log('Oracle client already initialized or using Thin mode');
      }
      
      this.pool = await oracledb.createPool({
        user: this.config.user,
        password: this.config.password,
        connectString: this.config.connectString,
        poolMin: dbConfig.pool.poolMin,
        poolMax: dbConfig.pool.poolMax,
        poolIncrement: dbConfig.pool.poolIncrement,
        poolTimeout: dbConfig.pool.poolTimeout,
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
      
      // Set connection-level character encoding for this session
      try {
        await connection.execute(`ALTER SESSION SET NLS_LANG='AMERICAN_AMERICA.AL32UTF8'`);
      } catch (err) {
        // If ALTER SESSION fails, continue anyway
        console.warn('Warning: Could not set session NLS_LANG:', err);
      }
      
      // Process bind parameters to ensure proper UTF-8 encoding for Oracle
      const processedBinds = binds.map(bind => {
        if (typeof bind === 'string') {
          // For string parameters, ensure proper UTF-8 encoding and Oracle type specification
          return {
            val: bind,
            type: oracledb.STRING,
            maxSize: bind.length * 4 // Allow for UTF-8 multi-byte characters
          };
        }
        return bind;
      });
      
      const defaultOptions: oracledb.ExecuteOptions = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true,
        // Ensure proper handling of Unicode/UTF-8 data
        fetchInfo: {},
        ...options
      };
      
      const result = await connection.execute<T>(sql, processedBinds, defaultOptions);
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
