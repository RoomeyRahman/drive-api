import {
    Entity,
    Column,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from '../../common/entities';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'folder' })
export class Folder extends BaseEntity {
    @Column({ type: 'varchar', length: 200 })
    @IsNotEmpty()
    name: string;

    @ManyToOne(() => Folder, folder => folder.children, { nullable: true })
    parent: Folder;

    @OneToMany(() => Folder, folder => folder.parent)
    children: Folder[];

    @ManyToOne(() => User, user => user.id)
    user: User;
}
