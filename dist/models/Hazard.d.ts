interface IHazardData {
    id?: number;
    code?: string;
    user_id: number;
    type_id: number;
    location_id: number;
    description: string;
    solution?: string;
    is_private: number;
    status_id: number;
    date_created?: Date;
    date_updated?: Date;
}
export declare class Hazard implements IHazardData {
    static modelFor: {
        createRequest: {
            user_id: number;
            type_id: number;
            location_id: number;
            description: string;
            solution?: string;
            is_private?: number;
            status_id: number;
        };
        updateRequest: {
            user_id?: number;
            type_id?: number;
            location_id?: number;
            description?: string;
            solution?: string;
            is_private?: number;
            status_id?: number;
        };
        fetchData: {
            ID?: number;
            CODE?: string;
            USER_ID: number;
            TYPE_ID: number;
            LOCATION_ID: number;
            DESCRIPTION: string;
            SOLUTION?: string | null;
            IS_PRIVATE: number;
            STATUS_ID: number;
            DATE_CREATED?: Date;
            DATE_UPDATED?: Date;
        };
    };
    id?: number;
    code?: string;
    user_id: number;
    type_id: number;
    location_id: number;
    description: string;
    solution?: string;
    is_private: number;
    status_id: number;
    date_created?: Date;
    date_updated?: Date;
    constructor(data: IHazardData);
    validate(): {
        isValid: boolean;
        errors: string[];
    };
    toDatabaseFormat(): typeof Hazard.modelFor.fetchData;
    toJSON(): IHazardData;
    static fromDatabase(row: any): Hazard;
    static fromRequestData(request: typeof Hazard.modelFor.createRequest): Hazard;
    updateWith(updateData: typeof Hazard.modelFor.updateRequest): void;
}
export type HazardCreateRequest = typeof Hazard.modelFor.createRequest;
export type HazardUpdateRequest = typeof Hazard.modelFor.updateRequest;
export type HazardData = IHazardData;
export type HazardOracleFormat = typeof Hazard.modelFor.fetchData;
export {};
//# sourceMappingURL=Hazard.d.ts.map