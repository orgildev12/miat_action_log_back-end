export declare class AlogTest {
    id: number;
    name: string;
    constructor(data?: Partial<AlogTest>);
    validate(): {
        isValid: boolean;
        errors: string[];
    };
    static fromDatabase(row: any): AlogTest;
    toDatabase(): any;
    toJSON(): any;
    isNew(): boolean;
    updateName(newName: string): void;
}
//# sourceMappingURL=AlogTest.d.ts.map