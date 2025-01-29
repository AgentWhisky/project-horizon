import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signin')
  async signIn(@Body() loginDto: LoginDto) {
    console.log(loginDto.username, loginDto.password);

    //return this.authenticationService.authenticate(loginDto.username, loginDto.password);

    return false;
  }

  @Post('signup')
  async signUp(@Body() loginDto: LoginDto) {
    console.log(loginDto.username, loginDto.password);

    return false;
  }
}
