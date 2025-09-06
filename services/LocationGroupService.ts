import {dbManager} from '../database';
import { LocationGroup } from '../models/LocationGroup';

export class LocationGroupService {

    async create(location_group: LocationGroup): Promise<LocationGroup> {
        const validation = location_group.validate();
        if(!validation.isValid){
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        const model = location_group.modelForUpdateDB();

        const result = await dbManager.executeQuery(
            `INSERT INTO location_group (name_en, name_mn)
             VALUES (:1, :2)`,
            [
                model.name_en,
                model.name_mn,
            ]
        );

        const generatedID = result.outBinds[0];
        const createdLocationGroup = await this.getById(generatedID);
        return createdLocationGroup;
    }

    async getById(id: number): Promise<LocationGroup> {
        const location_group = await dbManager.executeQuery(
            `SELECT * FROM location_group WHERE id = :1`,[id]
        );
        if(location_group.rows && location_group.rows.length > 0) {
            return LocationGroup.modelForFetchDB(location_group.rows[0]);
        }
        throw new Error(`location_group with ID: ${id} not found`);
    }

    async getAll(): Promise<LocationGroup[]> {
        const location_groups = await dbManager.executeQuery(
            `SELECT * FROM location_group`,[]
        );

        if(location_groups.rows){
            return location_groups.rows.map(row => LocationGroup.modelForFetchDB(row));
        }
        return [];
    }

    async update(id: number, location_group: LocationGroup): Promise<LocationGroup>{
        const validation = location_group.validate();
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        const locationGroup = location_group.modelForUpdateDB();
        const result = await dbManager.executeQuery(
            `UPDATE location_group
            SET name_en = :1, name_mn = :2
            WHERE id = :3            
            `,
            [
                locationGroup.name_en,
                locationGroup.name_mn,
                id
            ]
        );
        if ((result.rowsAffected || 0) === 0) {
            throw new Error(`Location group with ID ${id} not found`);
        }
        const updatedLGroup = await this.getById(id);
        return updatedLGroup;
    }

    async delete(id: number): Promise<boolean>{
        const result = await dbManager.executeQuery(
            `DELETE FROM location_group WHERE id = :1`,
            [id]
        );
        return (result.rowsAffected || 0) > 0;
    }
}