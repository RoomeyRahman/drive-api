import { Controller, Body, Post, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { IUser } from '../users/interfaces/user.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Auth Controller
 */
@ApiTags('Authentication')
@Controller()
export class AuthController {
    /**
     * Constructor
     * @param {AuthService} authService
     */
    constructor(private readonly authService: AuthService) {}

    /**
     * User login with jwtToken
     * @Body {AuthDTO} loginDto
     * @returns {Promise<IUser>}
     */
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Return user information.',
    })
    @Post('login')
    public async login(@Res() res, @Body() loginDto: AuthDTO): Promise<IUser> {
        const authRes = await this.authService.login(loginDto);

        return res
            .status(authRes.status)
            .set({
                'X-DRIVE-KEY': authRes.token,
                'X-DRIVE-KEY-EXPIRES': authRes.expiresIn,
            })
            .json(authRes.user);
    }
}
