import { dbManager } from '../../database';
import { User } from '../models/User';
import { ValidationError, NotFoundError, DatabaseUnavailableError } from '../middleware/errorHandler/errorTypes';

export class UserService {

    async create(requestData: typeof User.modelFor.createRequest): Promise<User> {
        const userValues = User.fromRequestData(requestData);
        const validation = userValues.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }
        const dbData = userValues.toDatabaseFormatInfo();
        const result = await dbManager.executeQuery(
            `INSERT INTO USERS (USER_NAME, EMAIL, PHONE_NUMBER, FIRST_NAME, LAST_NAME, PASSWORD, PIN)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                dbData.user_name,
                dbData.email,
                dbData.phone_number,
                dbData.first_name,
                dbData.last_name,
                dbData.password,
                dbData.pin
            ]
        );
        const packet = result.rows as import('mysql2/promise').ResultSetHeader;
        if (packet.affectedRows === 0) {
            throw new DatabaseUnavailableError('Failed to create user, please try again later');
        }
        return userValues;
    }

    async getUserByUsername(user_name: string): Promise<{ user: User; passwordHash: string } | null> {
        const result = await dbManager.executeQuery(
           `SELECT ID, USER_NAME, EMAIL, PHONE_NUMBER, FIRST_NAME, LAST_NAME, PASSWORD, PIN
            FROM USERS
            WHERE USER_NAME = ?`,
            [user_name]
        );
        const rows = result.rows as import('mysql2/promise').RowDataPacket[];
        if (rows.length > 0) {
            const row = rows[0];
            return {
                user: User.fromDatabase(row),
                passwordHash: User.getPasswordFromRow(row)
            };
        }
        return null;
    }

    async getById(id: number): Promise<User> {
        const result = await dbManager.executeQuery(
            `SELECT ID, USER_NAME, EMAIL, PHONE_NUMBER, FIRST_NAME, LAST_NAME, PASSWORD, PIN
            FROM USERS WHERE ID = ?`, 
            [id]
        );
        const rows = result.rows as import('mysql2/promise').RowDataPacket[];
        if (rows.length > 0) {
            return User.fromDatabase(rows[0]);
        }
        throw new NotFoundError(`User not found`);
    }


}