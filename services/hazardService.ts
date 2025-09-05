import { dbManager } from '../database';
import { Hazard } from '../models/Hazard';

export class HazardService {
  
  async create(hazard: Hazard): Promise<Hazard> {
    const validation = hazard.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const createData = hazard.toCreateDatabase();
    
    const result = await dbManager.executeQuery(
      `INSERT INTO hazard (user_id, type_id, location_id, description, solution, is_private, status_id)
       VALUES (:1, :2, :3, :4, :5, :6, :7)
       RETURNING id INTO :8`,
      [
        createData.USER_ID,
        createData.TYPE_ID,
        createData.LOCATION_ID,
        createData.DESCRIPTION,
        createData.SOLUTION,
        createData.IS_PRIVATE,
        createData.STATUS_ID,
        { dir: 3003, type: 2010 }
      ],
      { autoCommit: true }
    );

    const generatedId = result.outBinds[0];
    return await this.getById(generatedId);
  }

  async getById(id: number): Promise<Hazard> {
    const result = await dbManager.executeQuery(
      `SELECT *
       FROM hazard WHERE id = :1`,
      [id]
    );

    if (result.rows && result.rows.length > 0) {
      return Hazard.fromDatabase(result.rows[0]);
    }
    throw new Error(`Hazard with ID ${id} not found`);
  }

  async getAll(): Promise<Hazard[]> {
    const result = await dbManager.executeQuery(
      `SELECT id, code, user_id, type_id, location_id, description, solution, 
              is_private, status_id, date_created, date_updated
       FROM hazard ORDER BY date_created DESC`
    );

    if (result.rows) {
      return result.rows.map(row => Hazard.fromDatabase(row));
    }
    return [];
  }

  async update(id: number, hazard: Hazard): Promise<Hazard> {
    const validation = hazard.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const updateData = hazard.toCreateDatabase(); // Same data structure
    
    const result = await dbManager.executeQuery(
      `UPDATE hazard 
       SET user_id = :1, type_id = :2, location_id = :3, description = :4, 
           solution = :5, is_private = :6, status_id = :7, date_updated = SYSDATE
       WHERE id = :8`,
      [
        updateData.USER_ID,
        updateData.TYPE_ID,
        updateData.LOCATION_ID,
        updateData.DESCRIPTION,
        updateData.SOLUTION,
        updateData.IS_PRIVATE,
        updateData.STATUS_ID,
        id
      ],
      { autoCommit: true }
    );

    if ((result.rowsAffected || 0) === 0) {
      throw new Error(`Hazard with ID ${id} not found`);
    }

    return await this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `DELETE FROM hazard WHERE id = :1`,
      [id],
      { autoCommit: true }
    );

    return (result.rowsAffected || 0) > 0;
  }
}
