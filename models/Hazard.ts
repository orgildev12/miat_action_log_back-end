export class Hazard {
  public id?: number; // will be generated in DB
  public code?: string; // will be generated in DB
  public user_id: number;
  public type_id: number;
  public location_id: number;
  public description: string;
  public solution?: string;
  public is_private: number; // 0 or 1
  public status_id: number;
  public date_created?: Date; // will be generated in DB
  public date_updated?: Date; // will be generated in DB

  constructor(data: Partial<Hazard> = {}) {
    this.id = data.id;
    this.code = data.code;
    this.user_id = data.user_id || 0;
    this.type_id = data.type_id || 0;
    this.location_id = data.location_id || 0;
    this.description = data.description || '';
    this.solution = data.solution;
    this.is_private = data.is_private || 0;
    this.status_id = data.status_id || 0;
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
  }

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

  static fromDatabase(row: any): Hazard {
    return new Hazard({
      id: row.ID || row.id,
      code: row.CODE || row.code,
      user_id: row.USER_ID || row.user_id,
      type_id: row.TYPE_ID || row.type_id,
      location_id: row.LOCATION_ID || row.location_id,
      description: row.DESCRIPTION || row.description,
      solution: row.SOLUTION || row.solution,
      is_private: row.IS_PRIVATE || row.is_private || 0,
      status_id: row.STATUS_ID || row.status_id,
      date_created: row.DATE_CREATED || row.date_created,
      date_updated: row.DATE_UPDATED || row.date_updated
    });
  }

  // For INSERT - excludes auto-generated fields
  toCreateDatabase(): any {
    return {
      USER_ID: this.user_id,
      TYPE_ID: this.type_id,
      LOCATION_ID: this.location_id,
      DESCRIPTION: this.description,
      SOLUTION: this.solution || null,
      IS_PRIVATE: this.is_private,
      STATUS_ID: this.status_id
    };
  }

  toJSON(): any {
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
}
