import { z } from 'zod';

const TaskOwnerSchema = z.object({
    hazard_id: z.number().int().positive(),
    admin_id: z.number().int().positive(),
    is_collaborator: z.number().int().min(0).max(1, 'isCollaborator must be 0 or 1').default(0)
});

type ITaskOwnerData = z.infer<typeof TaskOwnerSchema>;

export class TaskOwner implements ITaskOwnerData {
    static modelFor = {
        createRequest: {} as {
            hazard_id: number;
            admin_id: number;
            is_collaborator: number;
        },
        updateRequest: {} as {
            hazard_id: number;
            admin_id: number;
            is_collaborator: number;
        },
        fetchData: {} as {
            HAZARD_ID: number;
            ADMIN_ID: number;
            IS_COLLABORATOR?: number;
        }
    };

    public hazard_id: number;
    public admin_id: number;
    public is_collaborator: number;
    public admin_name?: string;
    public role_id?: string;


    constructor(data: ITaskOwnerData & { group_name_en?: string | null, group_name_mn?: string | null }){
        this.hazard_id = data.hazard_id;
        this.admin_id = data.admin_id;
        this.is_collaborator = data.is_collaborator;
    }

    validate(): { isValid: boolean; errors: string[] } {
        const result = TaskOwnerSchema.safeParse(this);
        
        if (result.success) {
            return { isValid: true, errors: [] };
        }
        
        const errorMessages = result.error.issues.map(issue => issue.message);
        return { isValid: false, errors: errorMessages };
    }

    toDatabaseFormat(): typeof TaskOwner.modelFor.fetchData {
        return {
            HAZARD_ID: this.hazard_id,
            ADMIN_ID: this.admin_id,
            IS_COLLABORATOR: this.is_collaborator
        };
    }

    toJSON(): ITaskOwnerData {
        return {
            hazard_id: this.hazard_id,
            admin_id: this.admin_id,
            is_collaborator: this.is_collaborator,
        };
    }

    static fromDatabase(row: any): TaskOwner {
        const loc = new TaskOwner({
            hazard_id: row.HAZARD_ID,
            admin_id: row.ADMIN_ID,
            is_collaborator: row.IS_COLLABORATOR
        });
        loc.admin_name = row.ADMIN_NAME ?? null;
        loc.role_id = row.ROLE_ID ?? null;
        return loc;
    }

    static fromRequestData(request: typeof TaskOwner.modelFor.createRequest): TaskOwner {
        return new TaskOwner({
            hazard_id: request.hazard_id,
            admin_id: request.admin_id,
            is_collaborator: request.is_collaborator
        });
    }

    updateWith(updateData: typeof TaskOwner.modelFor.updateRequest): void {
        if (updateData.hazard_id !== undefined) this.hazard_id = updateData.hazard_id;
        if (updateData.admin_id !== undefined) this.admin_id = updateData.admin_id;
        if (updateData.is_collaborator !== undefined) this.is_collaborator = updateData.is_collaborator;
    }
}