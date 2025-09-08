import { z } from 'zod';

const LocationGroupSchema = z.object({
    id: z.number().int().positive().optional(), 
    name_en: z.string()
        .min(1, 'English name is required')
        .max(50, 'English name must be 50 characters or less')
        .trim(),
    name_mn: z.string()
        .min(1, 'Mongolian name is required')
        .max(50, 'Mongolian name must be 50 characters or less')
        .trim()
});

type ILocationGroupData = z.infer<typeof LocationGroupSchema>;

export class LocationGroup implements ILocationGroupData {
    static modelFor = {
        createRequest: {} as {
            name_en: string;
            name_mn: string;
        },
        updateRequest: {} as {
            name_en?: string;
            name_mn?: string;
        },
        fetchData: {} as {
            ID?: number;
            NAME_EN: string;
            NAME_MN: string;
        }
    };

    public id?: number;
    public name_en: string;
    public name_mn: string;

    constructor(data: ILocationGroupData) {
        this.id = data.id;
        this.name_en = data.name_en;
        this.name_mn = data.name_mn;
    }

    validate(): { isValid: boolean; errors: string[] } {
        const result = LocationGroupSchema.safeParse(this);
        
        if (result.success) {
            return { isValid: true, errors: [] };
        }
        
        const errorMessages = result.error.issues.map(issue => issue.message);
        return { isValid: false, errors: errorMessages };
    }

    toDatabaseFormat(): typeof LocationGroup.modelFor.fetchData {
        return {
            ID: this.id,
            NAME_EN: this.name_en,
            NAME_MN: this.name_mn
        };
    }

    toJSON(): ILocationGroupData {
        return {
            id: this.id,
            name_en: this.name_en,
            name_mn: this.name_mn
        };
    }

    static fromDatabase(row: any): LocationGroup {
        return new LocationGroup({
            id: row.ID,
            name_en: row.NAME_EN,
            name_mn: row.NAME_MN
        });
    }

    static fromRequestData(request: typeof LocationGroup.modelFor.createRequest): LocationGroup {
        return new LocationGroup({
            name_en: request.name_en,
            name_mn: request.name_mn
        });
    }

    updateWith(updateData: typeof LocationGroup.modelFor.updateRequest): void {
        if (updateData.name_en !== undefined) this.name_en = updateData.name_en;
        if (updateData.name_mn !== undefined) this.name_mn = updateData.name_mn;
    }
}

export type LocationGroupCreateRequest = typeof LocationGroup.modelFor.createRequest;
export type LocationGroupUpdateRequest = typeof LocationGroup.modelFor.updateRequest;
export type LocationGroupData = ILocationGroupData;
export type LocationGroupOracleFormat = typeof LocationGroup.modelFor.fetchData;