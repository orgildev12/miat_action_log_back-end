import { z } from 'zod';

const AdminRoleSchema = z.object({
    id: z.number().int().positive().optional(),
    role_name: z.string().min(4).max(50).trim(),
});

type IAdminRoleData = z.infer<typeof AdminRoleSchema>;


export class AdminRole implements IAdminRoleData {
    static modelFor = {
        createRequest: {} as {
            role_name: string;
        },
        updateRequest: {} as {
            role_name: string;
        },
        fetchData: {} as {
            ID?: number;
            ROLE_NAME: string;
        }
    };

    public id?: number;
    public role_name: string;

    constructor(data: IAdminRoleData){
        this.id = data.id;
        this.role_name = data.role_name;
    }

    validate(): { isValid: boolean; errors: string[] } {
        const result = AdminRoleSchema.safeParse(this);
        
        if (result.success) {
            return { isValid: true, errors: [] };
        }
        
        const errorMessages = result.error.issues.map(issue => issue.message);
        return { isValid: false, errors: errorMessages };
    }

    toDatabaseFormat(): typeof AdminRole.modelFor.fetchData {
        return {
            ID: this.id,
            ROLE_NAME: this.role_name,
        };
    }

    toJSON(): IAdminRoleData {
        return {
            id: this.id,
            role_name: this.role_name,
        };
    }

    static fromDatabase(row: any): AdminRole {
        return new AdminRole({
            id: row.ID,
            role_name: row.ROLE_NAME,
        });
    }

    static fromRequestData(request: typeof AdminRole.modelFor.createRequest): AdminRole {
        return new AdminRole({
            role_name: request.role_name
        });
    }

    updateWith(updateData: typeof AdminRole.modelFor.updateRequest): void {
        if (updateData.role_name !== undefined) this.role_name = updateData.role_name;
    }
}