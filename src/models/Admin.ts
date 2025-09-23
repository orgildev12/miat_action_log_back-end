import { z } from 'zod';

const AdminSchema = z.object({
    id: z.number().int().positive().optional(),
    user_id: z.number().int().positive(),
    role_id: z.number().int().positive()
});

const AdminJoinedSchema = z.object({
    user_name: z.string().min(4).max(50).trim().nullable().optional(),
    role_name: z.string().min(4).max(50).trim().nullable().optional()
});

type IAdminData = z.infer<typeof AdminSchema>;
type IAdminJoinedData = z.infer<typeof AdminJoinedSchema>;


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
            USER_NAME?: string;
            ROLE_NAME?: string;
        }
    };

    public id?: number;
    public user_id: number;
    public role_id: number;
    public user_name?: string | null;
    public role_name?: string | null;

    constructor(data: IAdminData, joined?: IAdminJoinedData){
        this.id = data.id;
        this.user_id = data.user_id;
        this.role_id = data.role_id;
        this.user_name = joined?.user_name ?? null;
        this.role_name = joined?.role_name ?? null;
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
            USER_NAME: this.user_name ?? undefined,
            ROLE_NAME: this.role_name ?? undefined
        };
    }

    toJSON(): IAdminData {
        return {
            id: this.id,
            user_id: this.user_id,
            role_id: this.role_id,
            ...(this.user_name !== undefined ? { user_name: this.user_name } : {}),
            ...(this.role_name !== undefined ? { role_name: this.role_name } : {})
        };
    }

    static fromDatabase(row: any): Admin {
        const core = AdminSchema.parse({
            id: row.ID,
            user_id: row.USER_ID,
            role_id: row.ROLE_ID
        });
        const joined = AdminJoinedSchema.safeParse({
            user_name: row.USER_NAME ?? null,
            role_name: row.ROLE_NAME ?? null
        });
        return new Admin(core, joined.success ? joined.data : undefined);
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