interface IHazardData {
    id?: number;
    code?: string;
    user_id: number;
    type_id: number;
    location_id: number;
    description: string;
    solution?: string;
    is_private: number;
    status_id: number;
    date_created?: Date;
    date_updated?: Date;
}

export class Hazard implements IHazardData {
    static modelFor = {
        createRequest: {} as {
            user_id: number;
            type_id: number;
            location_id: number;
            description: string;
            solution?: string;
            is_private?: number; // 0 or 1, defaults to 0
            status_id: number;
        },
        updateRequest: {} as {
            user_id?: number;
            type_id?: number;
            location_id?: number;
            description?: string;
            solution?: string;
            is_private?: number; // 0 or 1
            status_id?: number;
        },
        fetchData: {} as {
            ID?: number;
            CODE?: string;
            USER_ID: number;
            TYPE_ID: number;
            LOCATION_ID: number;
            DESCRIPTION: string;
            SOLUTION?: string | null;
            IS_PRIVATE: number;
            STATUS_ID: number;
            DATE_CREATED?: Date;
            DATE_UPDATED?: Date;
        }
    };

    public id?: number;
    public code?: string;
    public user_id: number;
    public type_id: number;
    public location_id: number;
    public description: string;
    public solution?: string;
    public is_private: number;
    public status_id: number;
    public date_created?: Date;
    public date_updated?: Date;

    constructor(data: IHazardData) {
        this.id = data.id;
        this.code = data.code;
        this.user_id = data.user_id;
        this.type_id = data.type_id;
        this.location_id = data.location_id;
        this.description = data.description;
        this.solution = data.solution;
        this.is_private = data.is_private || 0;
        this.status_id = data.status_id;
        this.date_created = data.date_created;
        this.date_updated = data.date_updated;
    }

    // Validation logic
    validate(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!this.user_id || this.user_id <= 0) {
            errors.push('User ID is required');
        }
        if (!this.type_id || this.type_id <= 0) {
            errors.push('Type ID is required');
        }
        if (!this.location_id || this.location_id <= 0) {
            errors.push('Location ID is required');
        }
        if (!this.description || this.description.trim().length === 0) {
            errors.push('Description is required');
        }
        if (!this.status_id || this.status_id <= 0) {
            errors.push('Status ID is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Convert to Oracle database format
    toDatabaseFormat(): typeof Hazard.modelFor.fetchData {
        return {
            ID: this.id,
            CODE: this.code,
            USER_ID: this.user_id,
            TYPE_ID: this.type_id,
            LOCATION_ID: this.location_id,
            DESCRIPTION: this.description,
            SOLUTION: this.solution || null,
            IS_PRIVATE: this.is_private,
            STATUS_ID: this.status_id,
            DATE_CREATED: this.date_created,
            DATE_UPDATED: this.date_updated
        };
    }

    // For API responses
    toJSON(): IHazardData {
        return {
            id: this.id,
            code: this.code,
            user_id: this.user_id,
            type_id: this.type_id,
            location_id: this.location_id,
            description: this.description,
            solution: this.solution,
            is_private: this.is_private,
            status_id: this.status_id,
            date_created: this.date_created,
            date_updated: this.date_updated
        };
    }

    // Create from Oracle database row
    static fromDatabase(row: any): Hazard {
        return new Hazard({
            id: row.ID,
            code: row.CODE,
            user_id: row.USER_ID,
            type_id: row.TYPE_ID,
            location_id: row.LOCATION_ID,
            description: row.DESCRIPTION,
            solution: row.SOLUTION,
            is_private: row.IS_PRIVATE || 0,
            status_id: row.STATUS_ID,
            date_created: row.DATE_CREATED,
            date_updated: row.DATE_UPDATED
        });
    }

    // Create new hazard from request data
    static fromRequestData(request: typeof Hazard.modelFor.createRequest): Hazard {
        return new Hazard({
            user_id: request.user_id,
            type_id: request.type_id,
            location_id: request.location_id,
            description: request.description,
            solution: request.solution,
            is_private: request.is_private || 0,
            status_id: request.status_id
        });
    }

    // Update with partial data
    updateWith(updateData: typeof Hazard.modelFor.updateRequest): void {
        if (updateData.user_id !== undefined) this.user_id = updateData.user_id;
        if (updateData.type_id !== undefined) this.type_id = updateData.type_id;
        if (updateData.location_id !== undefined) this.location_id = updateData.location_id;
        if (updateData.description !== undefined) this.description = updateData.description;
        if (updateData.solution !== undefined) this.solution = updateData.solution;
        if (updateData.is_private !== undefined) this.is_private = updateData.is_private;
        if (updateData.status_id !== undefined) this.status_id = updateData.status_id;
    }
}

// Type aliases for easier use (optional - for backwards compatibility)
export type HazardCreateRequest = typeof Hazard.modelFor.createRequest;
export type HazardUpdateRequest = typeof Hazard.modelFor.updateRequest;
export type HazardData = IHazardData;
export type HazardOracleFormat = typeof Hazard.modelFor.fetchData;
