import { z } from 'zod';

const UserSchema = z.object({
       id: z.number().int().positive().optional(),
       username: z.string().trim(),
       fname_en: z.string().trim().nullish(),
       fname_mn: z.string().trim(),
       lname_en: z.string().trim().nullish(),
       lname_mn: z.string().trim(),
       email: z.string().email('Invalid email format').max(320, 'Email must be 320 characters or less').nullish(),
       phone_number: z.string().length(8, 'Phone number must be exactly 8 digits').regex(/^\d{8}$/, 'Phone number must contain only digits').nullish()
});

// Simple schema for login requests
const AuthRequestSchema = z.object({
    username: z.string().trim().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required')
});

type IUserData = z.infer<typeof UserSchema>;
type IAuthRequest = z.infer<typeof AuthRequestSchema>;

export class User implements IUserData {
    static modelFor = {
        fetchData: {} as {
            EMP_ID: number;
            EMP_KEY: string;
            FNAME_ENG: string | null;
            FNAME: string;
            LNAME_ENG: string | null;
            LNAME: string;
            EMP_EMAIL: string | null;
            PHONE_MOBILE: string | null;
            EMP_PASSWORD: string;
        },
        authRequest: {} as IAuthRequest
    };

    public id?: number;
    public username: string;
    public fname_en: string | null;
    public fname_mn: string;
    public lname_en: string | null;
    public lname_mn: string;
    public email: string | null;
    public phone_number: string | null;

    constructor(data: IUserData){
        this.id = data.id;
        this.username = data.username;
        this.fname_en = data.fname_en ?? null;
        this.fname_mn = data.fname_mn;
        this.lname_en = data.lname_en ?? null;
        this.lname_mn = data.lname_mn;
        this.email = data.email ?? null;
        this.phone_number = data.phone_number ?? null;
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
            username: this.username,
            fname_en: this.fname_en,
            fname_mn: this.fname_mn,
            lname_en: this.lname_en,
            lname_mn: this.lname_mn,
            email: this.email,
            phone_number: this.phone_number
        };
    }

    toDatabaseFormat(): typeof User.modelFor.authRequest {
        return {
            username: this.username,
            password: '' // This will be handled separately in auth
        };
    }

    static fromDatabase(row: any): User {
        return new User({
            id: row.EMP_ID,
            username: row.EMP_KEY,
            fname_en: row.FNAME_ENG,
            fname_mn: row.FNAME,
            lname_en: row.LNAME_ENG,
            lname_mn: row.LNAME,
            email: row.EMP_EMAIL,
            phone_number: row.PHONE_MOBILE
        });
    }

    // Get password hash from database row separately for auth
    static getPasswordFromRow(row: any): string {
        return row.EMP_PASSWORD;
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
}