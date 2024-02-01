import {
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Folder } from '../entities/folder.entity';
import { User } from '../../users/entities/user.entity';

export class CreateFolderDto implements Readonly<CreateFolderDto> {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsString()
    @MaxLength(500)
    name: string;

    @ApiProperty()
    folder: Folder;

    @ApiProperty()
    user: User;
}

