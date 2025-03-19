import { Body, Controller, HttpCode, Param, ParseIntPipe, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LOGIN_ERROR } from 'src/common/constants/error-response.constants';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegistrationDto } from './dto/registration.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout-dto';
import { RequireRight } from 'src/decorators/require-right.decorator';
import { USER_RIGHTS } from 'src/common/constants/user-rights.constants';

@ApiTags('Authentication')
@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  @HttpCode(200)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Authenticate user', description: 'Logs in the user using Basic Auth and returns authentication details.' })
  @ApiOkResponse({ description: 'Successfully authenticated user.', type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid login credentials.' })
  @ApiForbiddenResponse({ description: 'Account is disabled.' })
  async userLogin(@Req() req): Promise<AuthResponseDto> {
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

  @Post('logout')
  @HttpCode(204)
  @RequireRight(USER_RIGHTS.DEFAULT)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Logout user', description: 'Invalidates the refresh token and logs the user out.' })
  @ApiNoContentResponse({ description: 'Successfully logged out.' })
  async userLogout(@Req() req): Promise<void> {
    const authHeader: string = req.headers.authorization;
    const authToken = authHeader.replace('Bearer ', '');

    return this.authenticationService.logout(authToken);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Creates a new user account and returns authentication details.' })
  @ApiBody({ type: RegistrationDto })
  @ApiCreatedResponse({ description: 'User registered successfully.', type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid registration data.' })
  @ApiForbiddenResponse({ description: 'Invalid creation code.' })
  @ApiConflictResponse({ description: 'Username already in use.' })
  async register(@Body() registrationDto: RegistrationDto): Promise<AuthResponseDto> {
    return this.authenticationService.register(registrationDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token', description: 'Exchanges a valid refresh token for a new access token.' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiCreatedResponse({ description: 'New access token issued.', type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid refresh token format.' })
  @ApiUnauthorizedResponse({ description: 'Expired or invalid refresh token.' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authenticationService.refresh(refreshTokenDto.refreshToken);
  }
}
