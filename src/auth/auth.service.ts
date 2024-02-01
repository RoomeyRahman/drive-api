import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
    HttpStatus,
    ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from '../users/interfaces/user.interface';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt.payload';
import { AuthDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
    /**
     * Constructor
     * @param {Repository<User>} userRepository
     * @param {JwtService} jwtService
     */
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Fetches a user from database by email for user validation
     * @param {AuthDTO} loginDto
     * @returns {Promise<IUser>} queried user data
     */
    private async validate(loginDto: AuthDTO): Promise<IUser> {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    email: loginDto.email,

                },
            });

            if (!user) {
                throw new NotFoundException(
                    `User ${loginDto.email} not found`,
                );
            }
            return user;
        } catch (error) {
            return;
        }
    }

    /**
     * Create a JWTtoken for authentication and return user data
     * @param {AuthDTO} loginDto
     * @returns Promise<any | { status: number; message: string } queried user data
     */
    public async login(
        loginDto: AuthDTO,
    ): Promise<any | { status: number; message: string }> {
        return this.validate(loginDto).then(userData => {
            if (!userData) {
                throw new NotFoundException('User Not Found');
            }

            if (userData.isDeleted) {
                throw new ForbiddenException('User is deleted');
            }

            if (!userData.isActive) {
                throw new ForbiddenException('User acount is on hold');
            }

            const passwordIsValid = bcrypt.compareSync(
                loginDto.password,
                userData.password,
            );

            if (!passwordIsValid == true) {
                throw new UnauthorizedException(
                    'Unauthorized access: Wrong password',
                );
            }

            const payload = {
                id: userData.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
            };

            const accessToken = this.jwtService.sign(payload);

            return {
                expiresIn: 7 * 24 * 60 * 60 * 1000,
                token: accessToken,
                user: payload,
                status: HttpStatus.OK,
            };
        });
    }

    /**
     * Validate a user with the JWTtoken for authentication
     * This will be used when the user has already logged in and has a JWT
     * @param {JwtPayload} payload
     * @returns  jwtToken
     */
    public async validateUserByJwt(payload: JwtPayload) {
        // This will be used when the user has already logged in and has a JWT
        const user = await this.userRepository.findOne({
            where: {
                email: payload.email,

            },
        });


        if (!user) {
            throw new UnauthorizedException();
        }
        return this.createJwtPayload(user);
    }

    /**
     * Create JWTPayload
     * This will be used when the user has already logged in and has a JWT
     * @param {IUser} user
     * @returns  jwtPayload
     */
    protected createJwtPayload(user) {
        const data: JwtPayload = {
            email: user.email,
        };

        const jwt = this.jwtService.sign(data);

        return {
            expiresIn: 7 * 24 * 60 * 60 * 1000,
            token: jwt,
        };
    }
}
