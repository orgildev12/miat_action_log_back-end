import { z } from 'zod';

const HazardTypeSchema = z.object({
    id: z.number().int().positive().optional(),
    name_en: z.string()
        .min(1, 'English name is required')
        .max(100, 'English name must be 100 characters or less')
        .trim(),
    name_mn: z.string()
        .min(1, 'Mongolian name is required')
        .max(100, 'Mongolian name must be 100 characters or less')
        .trim(),
    last_code: z.number().int().positive().optional()
});

type IHazardTypeData = z.infer<typeof HazardTypeSchema>;


export class HazardType implements IHazardTypeData {
    static modelFor = {
        createRequest: {} as {
            name_en: string;
            name_mn: string;
            last_code: number;
        },
        updateRequest: {} as {
            name_en?: string;
            name_mn?: string;
            last_code?: number;
        },
        fetchData: {} as {
            ID?: number;
            NAME_EN: string;
            NAME_MN: string;
            LAST_CODE?: number;
        }
    };

    public id?: number;
    public name_en: string;
    public name_mn: string;
    public last_code?: number;

    constructor(data: IHazardTypeData){
        this.id = data.id;
        this.name_en = data.name_en;
        this.name_mn = data.name_mn;
        this.last_code = data.last_code;
    }

    validate(): { isValid: boolean; errors: string[] } {
        const result = HazardTypeSchema.safeParse(this);
        
        if (result.success) {
            return { isValid: true, errors: [] };
        }
        
        const errorMessages = result.error.issues.map(issue => issue.message);
        return { isValid: false, errors: errorMessages };
    }

    toDatabaseFormat(): typeof HazardType.modelFor.fetchData {
        return {
            ID: this.id,
            NAME_EN: this.name_en,
            NAME_MN: this.name_mn,
            LAST_CODE: this.last_code
        };
    }

    toJSON(): IHazardTypeData {
        return {
            id: this.id,
            name_en: this.name_en,
            name_mn: this.name_mn,
            last_code: this.last_code
        };
    }

    static fromDatabase(row: any): HazardType {
        return new HazardType({
            id: row.ID,
            name_en: row.NAME_EN,
            name_mn: row.NAME_MN,
            last_code: row.LAST_CODE
        });
    }

    static fromRequestData(request: typeof HazardType.modelFor.createRequest): HazardType {
        return new HazardType({
            name_en: request.name_en,
            name_mn: request.name_mn,
            last_code: request.last_code
        });
    }

    updateWith(updateData: typeof HazardType.modelFor.updateRequest): void {
        if (updateData.name_en !== undefined) this.name_en = updateData.name_en;
        if (updateData.name_mn !== undefined) this.name_mn = updateData.name_mn;
    if (updateData.last_code !== undefined) this.last_code = updateData.last_code;
    }
}