import { z } from 'zod';

const UserSchema = z.object({
       id: z.number().int().positive().optional(),
       user_name: z.string().trim(),
       email: z.string().email('Invalid email format').max(320, 'Email must be 320 characters or less').nullish(),
       phone_number: z.string().length(8, 'Phone number must be exactly 8 digits').regex(/^\d{8}$/, 'Phone number must contain only digits').nullish(),
       first_name: z.string().trim().nullish(),
       last_name: z.string().trim().nullish(),
       password: z.string().trim().optional(),
       pin: z.string().trim().optional(),
});

// Simple schema for login requests
const AuthRequestSchema = z.object({
    user_name: z.string().trim().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required')
});

type IUserData = z.infer<typeof UserSchema>;
type IAuthRequest = z.infer<typeof AuthRequestSchema>;

export class User implements IUserData {
    static modelFor = {
        createRequest: {} as {
            user_name: string;
            email: string;
            phone_number: string;
            first_name: string;
            last_name: string;
            password: string;
            pin: string;
        },
        fetchData: {} as {
            ID: number;
            USER_NAME: string;
            EMAIL: string | null;
            PHONE_NUMBER: string | null;
            FIRST_NAME: string;
            LAST_NAME: string;
            PASSWORD: string;
            PIN: string | null;
        },
        authRequest: {} as IAuthRequest
    };

    public id?: number;
    public user_name: string;
    public email: string | null;
    public phone_number: string | null;
    public first_name: string | null;
    public last_name: string | null;
    public password?: string;
    public pin?: string;

    constructor(data: IUserData){
        this.id = data.id;
        this.user_name = data.user_name;
        this.email = data.email ?? null;
        this.phone_number = data.phone_number ?? null;
        this.first_name = data.first_name ?? null;
        this.last_name = data.last_name ?? null;
        this.password = data.password;
        this.pin = data.pin;
    }

    validate(): { isValid: boolean; errors: string[] } {
        const result = UserSchema.safeParse(this);

        if (result.success) {
            return { isValid: true, errors: [] };
        }

        const errorMessages = result.error.issues.map(issue => issue.message);
        return { isValid: false, errors: errorMessages };
    }

    toJSON(): IUserData {
        return {
            id: this.id,
            user_name: this.user_name,
            email: this.email,
            phone_number: this.phone_number,
            first_name: this.first_name,
            last_name: this.last_name,
        };
    }

    toDatabaseFormat(): typeof User.modelFor.authRequest {
        return {
            user_name: this.user_name,
            password: '' // This will be handled separately in auth
        };
    }

    toDatabaseFormatInfo(): typeof User.modelFor.createRequest {
        return {
            user_name: this.user_name,
            email: this.email ?? '',
            phone_number: this.phone_number ?? '',
            first_name: this.first_name ?? '',
            last_name: this.last_name ?? '',
            password: this.password ?? '',
            pin: this.pin ?? ''
        };
    }
    static fromDatabase(row: any): User {
        return new User({
            id: row.ID,
            user_name: row.USER_NAME,
            email: row.EMAIL,
            phone_number: row.PHONE_NUMBER,
            first_name: row.FIRST_NAME,
            last_name: row.LAST_NAME,
        });
    }

    // Get password hash from database row separately for auth
    static getPasswordFromRow(row: any): string {
        return row.PASSWORD;
    }    


    // Validate auth request separately from full user
    static validateAuthRequest(request: any): { isValid: boolean; errors: string[] } {
        const result = AuthRequestSchema.safeParse(request);
        if (result.success) {
            return { isValid: true, errors: [] };
        }
        const errorMessages = result.error.issues.map(issue => issue.message);
        return { isValid: false, errors: errorMessages };
    }

    static fromRequestData(requestData: typeof User.modelFor.createRequest): User {
        return new User({
            user_name: requestData.user_name,
            email: requestData.email ?? null,
            phone_number: requestData.phone_number ?? null,
            first_name: requestData.first_name ?? null,
            last_name: requestData.last_name ?? null,
        });
    }
}