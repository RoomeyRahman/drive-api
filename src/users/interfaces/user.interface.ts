export interface IUser {
    readonly id: string;
    readonly email: string;
    readonly password: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly isActive: boolean;
    readonly isDeleted: boolean;
}
