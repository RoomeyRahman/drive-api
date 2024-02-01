import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategies';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([User]),
        PassportModule.register({ defaultStrategy: 'jwt', session: false }),
        JwtModule.register({
            secret: process.env.SECRET_KEY_JWT,
            signOptions: {
                expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days
            },
        }),
    ],
    providers: [AuthService, UsersService, JwtStrategy],
    controllers: [AuthController],
    exports: [JwtModule, PassportModule, AuthService],
})
export class AuthModule {}
