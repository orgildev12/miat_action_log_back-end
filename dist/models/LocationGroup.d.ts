import { z } from 'zod';
declare const LocationGroupSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodInt>;
    name_en: z.ZodString;
    name_mn: z.ZodString;
}, z.core.$strip>;
type ILocationGroupData = z.infer<typeof LocationGroupSchema>;
export declare class LocationGroup implements ILocationGroupData {
    static modelFor: {
        createRequest: {
            name_en: string;
            name_mn: string;
        };
        updateRequest: {
            name_en?: string;
            name_mn?: string;
        };
        fetchData: {
            ID?: number;
            NAME_EN: string;
            NAME_MN: string;
        };
    };
    id?: number;
    name_en: string;
    name_mn: string;
    constructor(data: ILocationGroupData);
    validate(): {
        isValid: boolean;
        errors: string[];
    };
    toDatabaseFormat(): typeof LocationGroup.modelFor.fetchData;
    toJSON(): ILocationGroupData;
    static fromDatabase(row: any): LocationGroup;
    static fromRequestData(request: typeof LocationGroup.modelFor.createRequest): LocationGroup;
    updateWith(updateData: typeof LocationGroup.modelFor.updateRequest): void;
}
export type LocationGroupCreateRequest = typeof LocationGroup.modelFor.createRequest;
export type LocationGroupUpdateRequest = typeof LocationGroup.modelFor.updateRequest;
export type LocationGroupData = ILocationGroupData;
export type LocationGroupOracleFormat = typeof LocationGroup.modelFor.fetchData;
export {};
//# sourceMappingURL=LocationGroup.d.ts.map