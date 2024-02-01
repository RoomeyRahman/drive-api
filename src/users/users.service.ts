
import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IUser } from './interfaces/user.interface';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  /**
     * Constructor
     * @param {Repository<User>} userRepository
     */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  /**
   * Create a profile with RegisterPayload fields
   * @param {CreateUserDto} data user payload
   * @returns {Promise<IUser>} created user data
   */
  public async create(data: CreateUserDto): Promise<IUser> {
    try {
      const userDTO = new UserDTO();
      userDTO.email = data.email.toLowerCase();
      userDTO.password = bcrypt.hashSync(data.password, 8);

      if (
        data.hasOwnProperty('firstName') &&
        data.firstName
      ) {
        userDTO.firstName = data.firstName;
      }

      if (
        data.hasOwnProperty('lastName') &&
        data.lastName
      ) {
        userDTO.lastName = data.lastName;
      }

      const user = await this.userRepository.save(userDTO);

      return UserDTO.fromEntity(user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
