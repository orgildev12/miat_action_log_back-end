import { z } from 'zod';

const ResponseSchema = z.object({
    hazardId: z.number().int().positive(),
    currentStatus: z.enum(['Ирсэн', 'Ажиллаж байгаа', 'Шийдэгдсэн', 'Татгалзсан', 'Шалгаж байгаа', 'Зөвшөөрсөн', 'Буцаасан']).default('Ирсэн'),
    isStarted: z.number().int().min(0).max(1, 'isStarted must be 0 or 1').default(0),
    responseBody: z.string().nullish(),
    isRequestApproved: z.number().int().min(0).max(1, 'isRequestApproved must be 0 or 1').nullish(),
    isResponseFinished: z.number().int().min(0).max(1, 'isResponseFinished must be 0 or 1').default(0),
    responseFinishedDate: z.date().optional(),
    isCheckingResponse: z.number().int().min(0).max(1, 'isCheckingResponse must be 0 or 1').default(0),
    isResponseConfirmed: z.number().int().min(0).max(1, 'isResponseConfirmed must be 0 or 1').default(0),
    isResponseDenied: z.number().int().min(0).max(1, 'isResponseDenied must be 0 or 1').default(0),
    reasonToDeny: z.string().max(1000, 'Too long, it must be in 1000 characters').trim().nullish(),
    dateUpdated: z.date().optional()
});

type IResponseData = z.infer<typeof ResponseSchema>;

export class ResponseModel implements IResponseData {
    static modelFor = {
        fetchDataByAdmin: {} as {
            HAZARD_ID: number;
            CURRENT_STATUS: string | null;
            IS_STARTED: number;
            RESPONSE_BODY: string | null;
            IS_REQUEST_APPROVED: number | null;
            IS_RESPONSE_FINISHED: number;
            RESPONSE_FINISHED_DATE: Date | null;
            IS_CHECKING_RESPONSE: number;
            IS_RESPONSE_CONFIRMED: number;
            IS_RESPONSE_DENIED: number;
            REASON_TO_DENY: string | null;
            DATE_UPDATED: Date | null;
        },
        fetchDataByUser: {} as {
            HAZARD_ID: number;
            IS_STARTED: number;
            RESPONSE_BODY: string | null;
            IS_APPROVED: number | null;
            IS_CONFIRMED: number | null;
            DATE_UPDATED: Date | null;
        },
        createRequest: {} as {
            hazard_id: number;
            current_status?: string;
            is_started?: number;
            response_body?: string;
            is_request_approved?: number;
            is_response_finished?: number;
            response_finished_date?: Date;
            is_checking_response?: number;
            is_response_confirmed?: number;
            is_response_denied?: number;
            reason_to_deny?: string;
        }
    };

    public hazardId: number;
    public currentStatus: 'Ирсэн' | 'Ажиллаж байгаа' | 'Шийдэгдсэн' | 'Татгалзсан' | 'Шалгаж байгаа' | 'Зөвшөөрсөн' | 'Буцаасан';
    public isStarted: number;
    public responseBody: string | null;
    public isRequestApproved: number | null;
    public isResponseFinished: number; 
    public responseFinishedDate?: Date;   
    public isCheckingResponse: number;
    public isResponseConfirmed: number;
    public isResponseDenied: number;
    public reasonToDeny: string | null;
    public dateUpdated?: Date;

    constructor(data: IResponseData) {
        this.hazardId = data.hazardId;
        this.currentStatus = data.currentStatus;
        this.isStarted = data.isStarted ?? 0;
        this.responseBody = data.responseBody || null;
        this.isRequestApproved = data.isRequestApproved ?? null;
        this.isResponseFinished = data.isResponseFinished ?? 0;
        this.responseFinishedDate = data.responseFinishedDate;
        this.isCheckingResponse = data.isCheckingResponse ?? 0;
        this.isResponseConfirmed = data.isResponseConfirmed ?? 0;
        this.isResponseDenied = data.isResponseDenied ?? 0;
        this.reasonToDeny = data.reasonToDeny || null;
        this.dateUpdated = data.dateUpdated;
    }

    validate(): { isValid: boolean; errors: string[] } {
        const result = ResponseSchema.safeParse(this);
        
        if (result.success) {
            return { isValid: true, errors: [] };
        }
        
        const errorMessages = result.error.issues.map(issue => issue.message);
        return { isValid: false, errors: errorMessages };
    }

    toDatabaseFormatForAdmin(): typeof ResponseModel.modelFor.fetchDataByAdmin {
        return {
            HAZARD_ID: this.hazardId,
            CURRENT_STATUS: this.currentStatus,
            IS_STARTED: this.isStarted,
            RESPONSE_BODY: this.responseBody,
            IS_REQUEST_APPROVED: this.isRequestApproved,
            IS_RESPONSE_FINISHED: this.isResponseFinished,
            RESPONSE_FINISHED_DATE: this.responseFinishedDate ?? null,
            IS_CHECKING_RESPONSE: this.isCheckingResponse,
            IS_RESPONSE_CONFIRMED: this.isResponseConfirmed,
            IS_RESPONSE_DENIED: this.isResponseDenied,
            REASON_TO_DENY: this.reasonToDeny,
            DATE_UPDATED: this.dateUpdated ?? null
        };
    }

    toJSON(): IResponseData {
        return {
            hazardId: this.hazardId,
            currentStatus: this.currentStatus,
            isStarted: this.isStarted,
            responseBody: this.responseBody,
            isRequestApproved: this.isRequestApproved,
            isResponseFinished: this.isResponseFinished,
            responseFinishedDate: this.responseFinishedDate,
            isCheckingResponse: this.isCheckingResponse,
            isResponseConfirmed: this.isResponseConfirmed,
            isResponseDenied: this.isResponseDenied,
            reasonToDeny: this.reasonToDeny,
            dateUpdated: this.dateUpdated
        };
    }

    static fromDatabase(row: any): ResponseModel {
        return new ResponseModel({
            hazardId: row.HAZARD_ID,
            currentStatus: row.CURRENT_STATUS as 'Ирсэн' | 'Ажиллаж байгаа' | 'Шийдэгдсэн' | 'Татгалзсан' | 'Шалгаж байгаа' | 'Зөвшөөрсөн' | 'Буцаасан',
            isStarted: row.IS_STARTED,
            responseBody: row.RESPONSE_BODY,
            isRequestApproved: row.IS_REQUEST_APPROVED ?? null,
            isResponseFinished: row.IS_RESPONSE_FINISHED,
            responseFinishedDate: row.RESPONSE_FINISHED_DATE,
            isCheckingResponse: row.IS_CHECKING_RESPONSE,
            isResponseConfirmed: row.IS_RESPONSE_CONFIRMED,
            isResponseDenied: row.IS_RESPONSE_DENIED,
            reasonToDeny: row.REASON_TO_DENY,
            dateUpdated: row.DATE_UPDATED
        });
    }

    static fromRequestData(request: typeof ResponseModel.modelFor.createRequest): ResponseModel {
        return new ResponseModel({
            hazardId: request.hazard_id,
            currentStatus: 'Ирсэн',
            isStarted: request.is_started ?? 0,
            responseBody: request.response_body ?? null,
            isRequestApproved: request.is_request_approved ?? null,
            isResponseFinished: request.is_response_finished ?? 0,
            responseFinishedDate: request.response_finished_date,
            isCheckingResponse: request.is_checking_response ?? 0,
            isResponseConfirmed: request.is_response_confirmed ?? 0,
            isResponseDenied: request.is_response_denied ?? 0,
            reasonToDeny: request.reason_to_deny ?? null
        });
    }
}

export type ResponseCreateRequest = typeof ResponseModel.modelFor.createRequest;
export type ResponseData = IResponseData;
export type ResponseOracleFormat = typeof ResponseModel.modelFor.fetchDataByAdmin;
