import { Request, Response } from 'express';
export declare class AlogTestController {
    private alogTestService;
    constructor();
    getAllRecords(req: Request, res: Response): Promise<void>;
    createRecord(req: Request, res: Response): Promise<void>;
    getRecordById(req: Request, res: Response): Promise<void>;
    updateRecord(req: Request, res: Response): Promise<void>;
    deleteRecord(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=alogTestController.d.ts.map