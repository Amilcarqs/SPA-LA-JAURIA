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
import { RolesGuard } from './roles.guard';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from './roles.decorator';
import { CreateStaffDto } from './dto/create-staff.dto';

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

  // 2. Registro manual para Personal (Solo Admin)
  @Post('create-staff')
  @UseGuards(AuthGuard, RolesGuard) // Aplicamos el guardia de roles
  @Roles(Role.ADMIN)      // Solo usuarios con rol ADMIN pueden entrar aquí
  async createStaff(@Body() data: CreateStaffDto) {
    return this.authService.createStaff(data);
  }

/*   @Post('register')
  register(@Body() dto: any) {
    return this.authService.register(dto);
  } */
}
