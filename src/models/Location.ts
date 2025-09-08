import { z } from 'zod';

const LocationSchema = z.object({
    id: z.number().int().positive().optional(),
    name_en: z.string()
        .min(1, 'English name is required')
        .max(50, 'English name must be 50 characters or less')
        .trim(),
    name_mn: z.string()
        .min(1, 'Mongolian name is required')
        .max(50, 'Mongolian name must be 50 characters or less')
        .trim(),
    location_group_id: z.number().int().positive('Location group ID must be a positive integer')
});

type ILocationData = z.infer<typeof LocationSchema>;

export class Location implements ILocationData {
    static modelFor = {
        createRequest: {} as {
            name_en: string;
            name_mn: string;
            location_group_id: number;
        },
        updateRequest: {} as {
            name_en?: string;
            name_mn?: string;
            location_group_id?: number;
        },
        fetchData: {} as {
            ID?: number;
            NAME_EN: string;
            NAME_MN: string;
            LOCATION_GROUP_ID: number;
        }
    };

    public id?: number;
    public name_en: string;
    public name_mn: string;
    public location_group_id: number;

    constructor(data: ILocationData){
        this.id = data.id;
        this.name_en = data.name_en;
        this.name_mn = data.name_mn;
        this.location_group_id = data.location_group_id;
    }

    validate(): { isValid: boolean; errors: string[] } {
        const result = LocationSchema.safeParse(this);
        
        if (result.success) {
            return { isValid: true, errors: [] };
        }
        
        const errorMessages = result.error.issues.map(issue => issue.message);
        return { isValid: false, errors: errorMessages };
    }

    toDatabaseFormat(): typeof Location.modelFor.fetchData {
        return {
            ID: this.id,
            NAME_EN: this.name_en,
            NAME_MN: this.name_mn,
            LOCATION_GROUP_ID: this.location_group_id
        };
    }

    toJSON(): ILocationData {
        return {
            id: this.id,
            name_en: this.name_en,
            name_mn: this.name_mn,
            location_group_id: this.location_group_id
        };
    }

    static fromDatabase(row: any): Location {
        return new Location({
            id: row.ID,
            name_en: row.NAME_EN,
            name_mn: row.NAME_MN,
            location_group_id: row.LOCATION_GROUP_ID
        });
    }

    static fromRequestData(request: typeof Location.modelFor.createRequest): Location {
        return new Location({
            name_en: request.name_en,
            name_mn: request.name_mn,
            location_group_id: request.location_group_id
        });
    }

    updateWith(updateData: typeof Location.modelFor.updateRequest): void {
        if (updateData.name_en !== undefined) this.name_en = updateData.name_en;
        if (updateData.name_mn !== undefined) this.name_mn = updateData.name_mn;
    if (updateData.location_group_id !== undefined) this.location_group_id = updateData.location_group_id;
    }
}