import { ApiProperty } from '@nestjs/swagger';
import { Folder } from '../../folders/entities/folder.entity';

export class UpdateFileDto implements Readonly<UpdateFileDto> {
    @ApiProperty()
    folder: Folder;
}

