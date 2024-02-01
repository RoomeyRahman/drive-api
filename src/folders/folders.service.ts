import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { IUser } from '../users/interfaces/user.interface';

@Injectable()
export class FoldersService {
  /**
   * Constructor
   * @param {Repository<Folder>} repo
   */
  constructor(
    @InjectRepository(Folder)
    private readonly repo: Repository<Folder>,
  ) { }

  /**
   * Create record
   * @param {CreateFolderDto} data
   * @returns record
   */
  async create(data: CreateFolderDto, user: IUser) {
    try {
      return await this.repo.save({ ...data, user: user });
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
      const queryParam = query && query?.filter ? JSON.parse(query.filter) : {};
      return await this.repo.find({
        where: queryParam,
        relations: ['user', 'parent', 'children'],
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
        relations: ['user', 'parent', 'children'],
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
   * Update record
   * @param {string} id
   * @param {UpdateFolderDto} data
   */
  async update(
    id: string,
    data: UpdateFolderDto,
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

