import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsS3Service } from '../services';
import { CreateFileDto } from '../dto/create-file.dto';
import { File } from '../entities/files.entity';
import { UpdateFileDto } from '../dto/update-file.dto';
import { IUser } from '../../users/interfaces/user.interface';
import { User } from '../../users/entities/user.entity';
import { Folder } from '../../folders/entities/folder.entity';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  /**
   * Constructor
   * @param {service<AwsS3Service>} awsS3Service
   */
  constructor(
    @InjectRepository(File)
    private readonly repo: Repository<File>,
    private readonly awsS3Service: AwsS3Service,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Folder)
    private readonly folderRepo: Repository<Folder>,
  ) { }

  /**
   * Upload File
   * @param {Express.Multer.File} file
   * @returns {Promise<Object>}
   */
  async upload(file: Express.Multer.File) {
    const AWS_BUCKET_FOLDER = process.env.AWS_S3_BUCKET_FOLDER;
    const response = {
      Location: '',
    };

    const awsLocation = await this.awsS3Service.uploadToS3(
      file,
      AWS_BUCKET_FOLDER,
    );
    response.Location = awsLocation.Location;
    return response;
  }

  /**
   * create record
   * @param {string} id
   * @param {CreateFileDto} data
   */
  async create(
    data: CreateFileDto,
    user: IUser,
    file: Express.Multer.File
  ) {
    try {
      const fileLocation = await this.upload(file);
      data.url = fileLocation.Location;
      return await this.repo.save({ ...data, user: user });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Update record
   * @param {string} id
   * @param {UpdateFileDto} data
   */
  async update(
    id: string,
    data: UpdateFileDto,
  ) {
    try {
      const record = await this.repo.findOne({
        where: {
          id: id,
        },
      });

      if (!record) {
        throw new NotFoundException(`Record #${id} not found`);
      }

      return await this.repo.save({
        ...record,
        ...data,
        updatedAt: Date.now()
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * fetch records
   * @param {Object} query
   * @returns record[]
   */
  async findAll(query) {
    try {
      query && query?.filter && (query.filter = JSON.parse(query.filter));
      let queryParam: any = {};
      if (query && query?.user) {
        queryParam.user = await this.userRepo.findOne({
          where: {
            id: query.user
          }
        })
      }
      if (query && query?.filter) {
        if (query.filter?.folder === null) {
          query.filter.folder = IsNull();
        } else if (query.filter?.folder) {
          query.filter.folder = await this.folderRepo.findOne({
            where: {
              id: query.filter.folder
            }
          })
        }
      }


      if (query && query?.filter) {
        queryParam = {
          ...queryParam,
          ...query.filter,
        }
      }

      return await this.repo.find({
        where: queryParam,
        relations: ['folder'],
      })
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * fetch record by id
   * @param {string} id
   * @returns record[]
   */
  async findOne(id: string) {
    try {
      const record = await this.repo.findOne({
        where: {
          id: id,
        },
        relations: ['folder'],
      });

      if (!record) {
        throw new NotFoundException(`Record #${id} not found`);
      }
      return record;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * delete record by id
   * @param {string} id
   * @returns 
   */
  async remove(id: string) {
    try {
      return await this.repo.delete(id);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
