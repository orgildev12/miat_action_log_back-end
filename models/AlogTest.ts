export class AlogTest {
  public id: number;
  public name: string;

  constructor(data: Partial<AlogTest> = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
  }

  // Validation method
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (this.name && this.name.length > 255) {
      errors.push('Name must be less than 255 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Transform Oracle database row to model instance
  static fromDatabase(row: any): AlogTest {
    return new AlogTest({
      id: row.ID || row.id,
      name: row.NAME || row.name
    });
  }

  // Transform model instance to database format
  toDatabase(): any {
    return {
      ID: this.id,
      NAME: this.name.trim()
    };
  }

  // Clean JSON representation
  toJSON(): any {
    return {
      id: this.id,
      name: this.name
    };
  }

  // Business logic methods
  isNew(): boolean {
    return this.id === 0;
  }

  updateName(newName: string): void {
    this.name = newName;
  }
}
