import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RefreshTokenDto, RegistrationDto } from './dto/auth.dto';
import { AuthResponse, RegistrationInfo } from './authentication.model';
import { LOGIN_ERROR } from 'src/common/constants/error-response.constants';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @HttpCode(200)
  async userLogin(@Req() req): Promise<AuthResponse> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException(LOGIN_ERROR.INVALID_CREDENTIALS);
    }

    try {
      const base64Credentials = authHeader.split(' ')[1];
      const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      const [username, password] = decodedCredentials.split(':');

      return this.authenticationService.login({ username, password });
    } catch (error) {
      throw new UnauthorizedException(LOGIN_ERROR.INVALID_CREDENTIALS);
    }
  }

  @Post('logout/:userId')
  async userLogout(@Param('userId', ParseIntPipe) userId: number, @Body('jti') jti?: string) {
    return this.authenticationService.logout(userId, jti);
  }

  @Post('register')
  async register(@Body() registrationDto: RegistrationDto): Promise<AuthResponse> {
    const registrationInfo: RegistrationInfo = {
      username: registrationDto.username,
      password: registrationDto.password,
      creationCode: registrationDto.creationCode,
    };

    return this.authenticationService.register(registrationInfo);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    return this.authenticationService.refresh(refreshTokenDto.refreshToken);
  }
}
