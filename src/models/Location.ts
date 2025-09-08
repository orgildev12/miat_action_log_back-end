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
    location_group_id: z.int().positive('Location group ID must be a positive integer')
});

type ILocation = z.infer<typeof LocationSchema>;

export class Location implements ILocation {
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
            id: number;
            name_en: string;
            name_mn: string;
            location_group_id: number;
        },        
    };
        
    public id?: number;
    public name_en: string;
    public name_mn: string;
    public location_group_id: number;

    constructor(data: ILocation) {
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
}
        