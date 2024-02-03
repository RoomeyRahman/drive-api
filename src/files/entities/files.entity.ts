import {
    Entity,
    Column,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from '../../common/entities';
import { Folder } from '../../folders/entities/folder.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'file' })
export class File extends BaseEntity {
    @Column({ type: 'varchar', length: 200 })
    @IsNotEmpty()
    url: string;

    @ManyToOne(() => Folder, folder => folder.files)
    folder: Folder;

    @ManyToOne(() => User, user => user.files)
    user: User;
}
