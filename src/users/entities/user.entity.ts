import { Entity, Column, OneToMany } from 'typeorm';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { BaseEntity } from '../../common/entities';
import { Folder } from '../../folders/entities/folder.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @Column({ unique: true, type: 'varchar', length: 50 })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column({ type: 'varchar', length: 300 })
    @IsNotEmpty()
    password: string;

    @Column({ nullable: true, type: 'varchar', length: 50 })
    firstName: string;

    @Column({ nullable: true, type: 'varchar', length: 50 })
    lastName: string;

    @OneToMany(() => Folder, folder => folder.id)
    folders: Folder[];
}
