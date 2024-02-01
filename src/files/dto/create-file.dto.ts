import {
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Folder } from '../../folders/entities/folder.entity';

export class CreateFileDto implements Readonly<CreateFileDto> {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsString()
    @MaxLength(500)
    url: string;

    @ApiProperty()
    folder: Folder;
}

