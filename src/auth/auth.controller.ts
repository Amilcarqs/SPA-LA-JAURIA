import { 
    Body, 
    Controller, 
    Post, 
    HttpCode, 
    HttpStatus,
    Get,
    Request,
    UseGuards, 
    Query
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}


  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() { email, password }: LoginDto) {
    return this.authService.signIn(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req){
    return req.user;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // force client role
    const data = { ...createUserDto, role: (createUserDto as any).role ?? 'CLIENT' } as any;
    return this.authService.register(data);
  }


/*   @Post('register')
  register(@Body() dto: any) {
    return this.authService.register(dto);
  } */
}
