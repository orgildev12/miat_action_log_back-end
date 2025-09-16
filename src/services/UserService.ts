import { dbManager } from '../../database';
import { User } from '../models/User';
import { ValidationError, NotFoundError } from '../middleware/errorHandler/errorTypes';

export class UserService {
    private static readonly EMPLOYEES_TABLE = process.env.EMPLOYEES_TABLE;

    async getUserByUsername(username: string): Promise<{ user: User; passwordHash: string } | null> {
        const result = await dbManager.executeQuery(
            `SELECT EMP_ID, EMP_KEY, FNAME_ENG, FNAME, LNAME_ENG, LNAME, EMP_EMAIL, PHONE_MOBILE, EMP_PASSWORD 
            FROM ${UserService.EMPLOYEES_TABLE}
            WHERE EMP_KEY = :1`,
            [username]
        );
        
        if (result.rows && result.rows.length > 0) {
            const row = result.rows[0];
            return {
                user: User.fromDatabase(row),
                passwordHash: User.getPasswordFromRow(row)
            };
        }
        
        return null;
    }

    async getById(id: number): Promise<User> {
        const result = await dbManager.executeQuery(
            `SELECT EMP_ID, EMP_KEY, FNAME_ENG, FNAME, LNAME_ENG, LNAME, EMP_EMAIL, PHONE_MOBILE, EMP_PASSWORD
            FROM ${UserService.EMPLOYEES_TABLE} WHERE EMP_ID = :1`, 
            [id]
        );
        if (result.rows && result.rows.length > 0) {
            return User.fromDatabase(result.rows[0]);
        }
        throw new NotFoundError(`User not found`);
    }
}