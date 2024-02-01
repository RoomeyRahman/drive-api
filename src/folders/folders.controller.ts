import {
  HttpStatus,
  Controller,
  Body,
  Delete,
  Get,
  HttpException,
  Patch,
  Post,
  Param,
  Query,
  UsePipes,
  UseGuards
} from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { User } from '../common/decorators/user.decorator';
import { IUser } from '../users/interfaces/user.interface';
import {
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  NullValidationPipe,
  ValidationPipe,
  TrimPipe,
} from '../common/pipes';

@ApiTags('Folders')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) { }

  /**
  * Create a record
  * @Body {CreateFolderDto} data
  */
  @ApiOperation({ summary: 'Create a new record' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new record.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @Post()
  create(
    @Body() data: CreateFolderDto,
    @User() user: IUser,
  ) {
    try {
      return this.foldersService.create(data, user);
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.BAD_REQUEST,
        {
          cause: new Error(err)
        }
      );
    }
  }

  /**
   * Fetchs records
   * @Param {string} query
   */
  @ApiOperation({ summary: 'Fetches records' })
  @ApiResponse({ status: 200, description: 'Returns list of records.' })
  @Get()
  findAll(
    @Query() query,
    @User() user: IUser,
  ) {
    try {
      query.user = user.id;
      return this.foldersService.findAll(query);
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.BAD_REQUEST,
        {
          cause: new Error(err)
        }
      );
    }
  }

  /**
   * Fetch a record by id 
   * @Param {string} id
   */
  @ApiOperation({ summary: 'Get a record by id' })
  @ApiResponse({ status: 200, description: 'Returns record.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record Not found.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.foldersService.findOne(id);
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.BAD_REQUEST,
        {
          cause: new Error(err)
        }
      );
    }
  }

  /**
   * update record
   * @param {UpdateFolderDto} data
   */
  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @ApiOperation({ summary: 'Update record' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return record' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record not found',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateFolderDto) {
    try {
      return this.foldersService.update(id, data);
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.BAD_REQUEST,
        {
          cause: new Error(err)
        }
      );
    }
  }

  /**
   * delete record
   * @param {string} id
   */
  @ApiOperation({ summary: 'delete record' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Delete record' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.foldersService.remove(id);
    } catch (err) {
      throw new HttpException(
        err,
        err.status || HttpStatus.BAD_REQUEST,
        {
          cause: new Error(err)
        }
      );
    }
  }
}
