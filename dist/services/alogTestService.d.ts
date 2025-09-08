import { AlogTest } from '../models/AlogTest';
export declare class AlogTestService {
    getAllRecords(): Promise<AlogTest[]>;
    createRecord(data: {
        name: string;
    }): Promise<{
        success: boolean;
        record?: AlogTest;
        errors?: string[];
    }>;
    getRecordById(id: string): Promise<AlogTest | null>;
    updateRecord(id: string, data: {
        name: string;
    }): Promise<{
        success: boolean;
        record?: AlogTest;
        errors?: string[];
    }>;
    deleteRecord(id: string): Promise<{
        success: boolean;
        errors?: string[];
    }>;
}
//# sourceMappingURL=alogTestService.d.ts.map