import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Body,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  Param,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadDTO } from '../dto/file-upload.dto';
import { FilesService } from '../services/files.service';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';
import { JwtAuthGuard } from '../../auth/guards/jwtAuth.guard';
import { User } from '../../common/decorators/user.decorator';
import { IUser } from '../../users/interfaces/user.interface';
import {
  NullValidationPipe,
  ValidationPipe,
  TrimPipe,
} from '../../common/pipes';

@ApiTags('Files')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'File or Image Upload Dynamic Bucket' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return upload information.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDTO })
  @UsePipes(new ValidationPipe(true))
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @Body() data: CreateFileDto,
    @User() user: IUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.filesService.create(data, user, file);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
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
      return this.filesService.findAll(query);
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
      return this.filesService.findOne(id);
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
   * @param {UpdateFileDto} data
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
  update(@Param('id') id: string, @Body() data: UpdateFileDto) {
    try {
      return this.filesService.update(id, data);
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
      return this.filesService.remove(id);
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
