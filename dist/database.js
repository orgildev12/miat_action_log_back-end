"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbManager = exports.DatabaseManager = void 0;
const oracledb_1 = __importDefault(require("oracledb"));
const db_1 = require("./src/config/db");
process.env.NLS_LANG = 'AMERICAN_AMERICA.AL32UTF8';
process.env.NLS_NCHAR = 'AL32UTF8';
class DatabaseManager {
    constructor() {
        this.pool = null;
        this.config = { ...db_1.dbConfig.connection };
    }
    static getInstance() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }
    async initialize() {
        try {
            oracledb_1.default.fetchAsString = [oracledb_1.default.CLOB];
            oracledb_1.default.fetchAsBuffer = [oracledb_1.default.BLOB];
            oracledb_1.default.stmtCacheSize = 40;
            try {
                oracledb_1.default.initOracleClient({
                    libDir: undefined,
                });
            }
            catch (err) {
                console.log('Oracle client already initialized or using Thin mode');
            }
            this.pool = await oracledb_1.default.createPool({
                user: this.config.user,
                password: this.config.password,
                connectString: this.config.connectString,
                poolMin: db_1.dbConfig.pool.poolMin,
                poolMax: db_1.dbConfig.pool.poolMax,
                poolIncrement: db_1.dbConfig.pool.poolIncrement,
                poolTimeout: db_1.dbConfig.pool.poolTimeout,
            });
            console.log('✅ Oracle Database connection pool created successfully');
        }
        catch (error) {
            console.error('❌ Error creating Oracle Database connection pool:', error);
            throw error;
        }
    }
    async executeQuery(sql, binds = [], options = {}) {
        if (!this.pool) {
            throw new Error('Database pool not initialized');
        }
        let connection;
        try {
            connection = await this.pool.getConnection();
            try {
                await connection.execute(`ALTER SESSION SET NLS_LANG='AMERICAN_AMERICA.AL32UTF8'`);
            }
            catch (err) {
                console.warn('Warning: Could not set session NLS_LANG:', err);
            }
            const processedBinds = binds.map(bind => {
                if (typeof bind === 'string') {
                    return {
                        val: bind,
                        type: oracledb_1.default.STRING,
                        maxSize: bind.length * 4
                    };
                }
                return bind;
            });
            const defaultOptions = {
                outFormat: oracledb_1.default.OUT_FORMAT_OBJECT,
                autoCommit: true,
                fetchInfo: {},
                ...options
            };
            const result = await connection.execute(sql, processedBinds, defaultOptions);
            return result;
        }
        catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
        finally {
            if (connection) {
                try {
                    await connection.close();
                }
                catch (error) {
                    console.error('Error closing connection:', error);
                }
            }
        }
    }
    async executeMany(sql, binds, options = {}) {
        if (!this.pool) {
            throw new Error('Database pool not initialized');
        }
        let connection;
        try {
            connection = await this.pool.getConnection();
            const defaultOptions = {
                autoCommit: true,
                ...options
            };
            const result = await connection.executeMany(sql, binds, defaultOptions);
            return result;
        }
        catch (error) {
            console.error('Database executeMany error:', error);
            throw error;
        }
        finally {
            if (connection) {
                try {
                    await connection.close();
                }
                catch (error) {
                    console.error('Error closing connection:', error);
                }
            }
        }
    }
    async testConnection() {
        try {
            const result = await this.executeQuery('SELECT SYSDATE FROM DUAL');
            console.log('✅ Database connection test successful:', result.rows);
            return true;
        }
        catch (error) {
            console.error('❌ Database connection test failed:', error);
            return false;
        }
    }
    async close() {
        if (this.pool) {
            try {
                await this.pool.close();
                console.log('✅ Database pool closed successfully');
            }
            catch (error) {
                console.error('❌ Error closing database pool:', error);
                throw error;
            }
        }
    }
}
exports.DatabaseManager = DatabaseManager;
exports.dbManager = DatabaseManager.getInstance();
//# sourceMappingURL=database.js.map