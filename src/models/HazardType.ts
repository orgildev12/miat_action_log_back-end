import { z } from 'zod';

const HazardTypeSchema = z.object({
    id: z.number().int().positive().optional(),
    short_code: z.string()
        .min(1, 'Short code is required')
        .max(10, 'Short code must be 10 characters or less')
        .trim(),
    name_en: z.string()
        .min(1, 'English name is required')
        .max(100, 'English name must be 100 characters or less')
        .trim(),
    name_mn: z.string()
        .min(1, 'Mongolian name is required')
        .max(100, 'Mongolian name must be 100 characters or less')
        .trim(),
    isPrivate: z.number().int().refine(value => value === 0 || value === 1, {
        message: 'isPrivate must be either 0 or 1'
    }),
    last_index: z.number().int().positive().optional()
});

type IHazardTypeData = z.infer<typeof HazardTypeSchema>;


export class HazardType implements IHazardTypeData {
    static modelFor = {
        createRequest: {} as {
            short_code: string;
            name_en: string;
            name_mn: string;
            isPrivate: number;
        },
        updateRequest: {} as {
            short_code?: string;
            name_en?: string;
            name_mn?: string;
            isPrivate?: number;
        },
        fetchData: {} as {
            ID?: number;
            SHORT_CODE: string;
            NAME_EN: string;
            NAME_MN: string;
            IS_PRIVATE: number;
            LAST_INDEX?: number;
        }
    };

    public id?: number;
    public short_code: string;
    public name_en: string;
    public name_mn: string;
    public isPrivate: number;
    public last_index?: number;

    constructor(data: IHazardTypeData){
        this.id = data.id;
        this.short_code = data.short_code.toUpperCase();
        this.name_en = data.name_en;
        this.name_mn = data.name_mn;
        this.isPrivate = data.isPrivate;
        this.last_index = data.last_index;
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
            SHORT_CODE: this.short_code,
            NAME_EN: this.name_en,
            NAME_MN: this.name_mn,
            IS_PRIVATE: this.isPrivate,
            LAST_INDEX: this.last_index
        };
    }

    toJSON(): IHazardTypeData {
        return {
            id: this.id,
            short_code: this.short_code,
            name_en: this.name_en,
            name_mn: this.name_mn,
            isPrivate: this.isPrivate,
            last_index: this.last_index
        };
    }

    static fromDatabase(row: any): HazardType {
        return new HazardType({
            id: row.ID,
            short_code: row.SHORT_CODE,
            name_en: row.NAME_EN,
            name_mn: row.NAME_MN,
            isPrivate: row.IS_PRIVATE,
            last_index: row.LAST_INDEX
        });
    }

    static fromRequestData(request: typeof HazardType.modelFor.createRequest): HazardType {
        return new HazardType({
            short_code: request.short_code,
            name_en: request.name_en,
            name_mn: request.name_mn,
            isPrivate: request.isPrivate,
        });
    }

    updateWith(updateData: typeof HazardType.modelFor.updateRequest): void {
        if (updateData.short_code !== undefined) this.short_code = updateData.short_code;
        if (updateData.name_en !== undefined) this.name_en = updateData.name_en;
        if (updateData.name_mn !== undefined) this.name_mn = updateData.name_mn;
        if (updateData.isPrivate !== undefined) this.isPrivate = updateData.isPrivate;}
}