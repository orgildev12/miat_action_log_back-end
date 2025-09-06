export class LocationGroup {
    public id?: number; // will be generated in DB
    public name_en: string;
    public name_mn: string;

    constructor(data: Partial<LocationGroup> = {}){
        this.id = data.id;
        this.name_en;
        this.name_mn;
    }

    validate(): {
        isValid: boolean;
        errors: string[]
    }{
        const errors: string[] = [];

        if(!this.name_en){
            errors.push('name_en is required');
        }
        if(!this.name_mn){
            errors.push('name_mn is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    }

    static modelForFetchDB(row: any): LocationGroup {
        return new LocationGroup({
            id: row.id,
            name_en: row.name_en,
            name_mn: row.name_mn
        });
    }

    static modelForUpdateDB(row: any): LocationGroup {
        return new LocationGroup({
            name_en: row.name_en,
            name_mn: row.name_mn
        });
    }

    modelForUpdateDB(): any {
        return {
            name_en: this.name_en,
            name_mn: this.name_mn
        };
    }

    toJSON(): any {
        return {
            id: this.id,
            name_en: this.name_en,
            name_mn: this.name_mn
        };
    }
}