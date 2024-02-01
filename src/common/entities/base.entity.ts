import {
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @CreateDateColumn({
        type: 'bigint',
        default: Date.now(),
    })
    createAt: number;

    @Column({ nullable: true, type: 'varchar', length: 300 })
    createdBy: string;

    @UpdateDateColumn({
        type: 'bigint',
        default: Date.now(),
    })
    updatedAt: number;

    @Column({ nullable: true, type: 'varchar', length: 300 })
    updatedBy: string;
}
