import { z } from 'zod';

const IHazardImageSchema = z.object({
    id: z.number().int().positive(),
    hazard_id: z.number().int().positive(),
    image_data: z.instanceof(Buffer),
});

type IHazardImageData = z.infer<typeof IHazardImageSchema>;


export class HazardImage implements IHazardImageData {

    public id: number;
    public hazard_id: number;
    public image_data: Buffer;

    constructor(data: IHazardImageData){
        this.id = data.id;
        this.hazard_id = data.hazard_id;
        this.image_data = data.image_data
    }

    validate(): { isValid: boolean; errors: string[] } {
        const result = IHazardImageSchema.safeParse(this);
        
        if (result.success) {
            return { isValid: true, errors: [] };
        }
        
        const errorMessages = result.error.issues.map(issue => issue.message);
        return { isValid: false, errors: errorMessages };
    }

    toJSON(): IHazardImageData {
        return {
            id: this.id,
            hazard_id: this.hazard_id,
            image_data: this.image_data
        };
    }

    static fromDatabase(row: any): HazardImage {
        return new HazardImage({
            id: row.ID,
            hazard_id: row.HAZARD_ID,
            image_data: row.IMAGE_DATA
        });
    }
}