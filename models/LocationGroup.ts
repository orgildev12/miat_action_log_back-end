// Core data interface
interface ILocationGroupData {
    id?: number;
    name_en: string;
    name_mn: string;
}

export class LocationGroup implements ILocationGroupData {
    static modelFor = {
        createRequest: {} as {
            name_en: string;
            name_mn: string;
        },
        updateRequest: {} as {
            name_en?: string;
            name_mn?: string;
        },
        fetchData: {} as {
            ID?: number;
            NAME_EN: string;
            NAME_MN: string;
        }
    };

    public id?: number;
    public name_en: string;
    public name_mn: string;

    constructor(data: ILocationGroupData) {
        this.id = data.id;
        this.name_en = data.name_en;
        this.name_mn = data.name_mn;
    }

    // Validation logic
    validate(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!this.name_en || this.name_en.trim().length === 0) {
            errors.push('English name is required');
        }
        if (!this.name_mn || this.name_mn.trim().length === 0) {
            errors.push('Mongolian name is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Convert to Oracle database format
    toDatabaseFormat(): typeof LocationGroup.modelFor.fetchData {
        return {
            ID: this.id,
            NAME_EN: this.name_en,
            NAME_MN: this.name_mn
        };
    }

    // For API responses
    toJSON(): ILocationGroupData {
        return {
            id: this.id,
            name_en: this.name_en,
            name_mn: this.name_mn
        };
    }

    // Create from Oracle database row
    static fromDatabase(row: any): LocationGroup {
        return new LocationGroup({
            id: row.ID,
            name_en: row.NAME_EN,
            name_mn: row.NAME_MN
        });
    }

    // Create new location group from request data
    static fromRequestData(request: typeof LocationGroup.modelFor.createRequest): LocationGroup {
        return new LocationGroup({
            name_en: request.name_en,
            name_mn: request.name_mn
        });
    }

    // Update with partial data
    updateWith(updateData: typeof LocationGroup.modelFor.updateRequest): void {
        if (updateData.name_en !== undefined) this.name_en = updateData.name_en;
        if (updateData.name_mn !== undefined) this.name_mn = updateData.name_mn;
    }
}

// Type aliases for easier use (optional - for backwards compatibility)
export type LocationGroupCreateRequest = typeof LocationGroup.modelFor.createRequest;
export type LocationGroupUpdateRequest = typeof LocationGroup.modelFor.updateRequest;
export type LocationGroupData = ILocationGroupData;
export type LocationGroupOracleFormat = typeof LocationGroup.modelFor.fetchData;