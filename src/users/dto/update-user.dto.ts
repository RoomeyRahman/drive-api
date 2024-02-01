import {
    IsString,
    MaxLength,
    MinLength,
    Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto implements Readonly<UpdateUserDto> {
    @ApiProperty()
    @MaxLength(30)
    @MinLength(3)
    @Matches(/^[a-zA-Z ]+$/)
    @IsString()
    firstName: string;

    @ApiProperty()
    @MaxLength(30)
    @MinLength(3)
    @Matches(/^[a-zA-Z ]+$/)
    @IsString()
    lastName: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isDeleted: boolean;
}