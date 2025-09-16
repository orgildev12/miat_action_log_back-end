import { z } from 'zod';

const AdminSchema = z.object({
    id: z.number().int().positive().optional(),
    user_id: z.number().int().positive(),
    role_name: z.enum(['admin', 'response-admin', 'audit-admin', 'special-admin', 'super-admin']).default('admin')
});

type IAdminData = z.infer<typeof AdminSchema>;


export class Admin implements IAdminData {
    static modelFor = {
        createRequest: {} as {
            user_id: number;
            role_name: string;
        },
        updateRequest: {} as {
            role_name?: string;
        },
        fetchData: {} as {
            ID?: number;
            USER_ID: number;
            ROLE_NAME: string;
        }
    };

    public id?: number;
    public user_id: number;
    public role_name: string;

    constructor(data: IAdminData){
        this.id = data.id;
        this.user_id = data.user_id;
        this.role_name = data.role_name;
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
            ROLE_NAME: this.role_name,
        };
    }

    toJSON(): IAdminData {
        return {
            id: this.id,
            user_id: this.user_id,
            role_name: this.role_name,
        };
    }

    static fromDatabase(row: any): Admin {
        return new Admin({
            id: row.ID,
            user_id: row.user_id,
            role_name: row.role_name,
        });
    }

    static fromRequestData(request: typeof Admin.modelFor.createRequest): Admin {
        return new Admin({
            user_id: request.user_id,
            role_name: request.role_name
        });
    }

    updateWith(updateData: typeof Admin.modelFor.updateRequest): void {
        if (updateData.role_name !== undefined) this.role_name = updateData.role_name;
    }
}