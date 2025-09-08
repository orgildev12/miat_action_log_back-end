import oracledb from 'oracledb';
export interface DatabaseConfig {
    user: string;
    password: string;
    connectString: string;
}
export declare class DatabaseManager {
    private static instance;
    private pool;
    private config;
    private constructor();
    static getInstance(): DatabaseManager;
    initialize(): Promise<void>;
    executeQuery<T = any>(sql: string, binds?: any[], options?: oracledb.ExecuteOptions): Promise<oracledb.Result<T>>;
    executeMany(sql: string, binds: any[][], options?: oracledb.ExecuteManyOptions): Promise<oracledb.Results<any>>;
    testConnection(): Promise<boolean>;
    close(): Promise<void>;
}
export declare const dbManager: DatabaseManager;
//# sourceMappingURL=database.d.ts.map