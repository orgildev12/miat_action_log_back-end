import { z } from 'zod';

const AdminSchema = z.object({
    id: z.number().int().positive().optional(),
    user_id: z.number().int().positive(),
    role_id: z.number().int().positive(),
});

type IAdminData = z.infer<typeof AdminSchema>;


export class Admin implements IAdminData {
    static modelFor = {
        createRequest: {} as {
            user_id: number;
            role_id: number;
        },
        updateRequest: {} as {
            role_id?: number;
        },
        fetchData: {} as {
            ID?: number;
            USER_ID: number;
            ROLE_ID: number;
        }
    };

    public id?: number;
    public user_id: number;
    public role_id: number;

    constructor(data: IAdminData){
        this.id = data.id;
        this.user_id = data.user_id;
        this.role_id = data.role_id;
    }

    validate(): { isValid: boolean; errors: string[] } {
        const result = AdminSchema.safeParse(this);
        
        if (result.success) {
            return { isValid: true, errors: [] };
        }
        
        const errorMessages = result.error.issues.map(issue => issue.message);
        return { isValid: false, errors: errorMessages };
    }

    toDatabaseFormat(): typeof Admin.modelFor.fetchData {
        return {
            ID: this.id,
            USER_ID: this.user_id,
            ROLE_ID: this.role_id,
        };
    }

    toJSON(): IAdminData {
        return {
            id: this.id,
            user_id: this.user_id,
            role_id: this.role_id,
        };
    }

    static fromDatabase(row: any): Admin {
        return new Admin({
            id: row.ID,
            user_id: row.user_id,
            role_id: row.role_id,
        });
    }

    static fromRequestData(request: typeof Admin.modelFor.createRequest): Admin {
        return new Admin({
            user_id: request.user_id,
            role_id: request.role_id
        });
    }

    updateWith(updateData: typeof Admin.modelFor.updateRequest): void {
        if (updateData.role_id !== undefined) this.role_id = updateData.role_id;
    }
}