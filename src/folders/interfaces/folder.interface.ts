export interface IFolder {
    readonly id: string;
    readonly name: string;
    readonly parent: string;
    readonly children: string[];
    readonly user: string;
    readonly isActive: boolean;
    readonly isDeleted: boolean;
}
