import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto as any);
    const { password, ...rest } = user as any;
    return rest;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('staff')
  async createStaff(@Body() createUserDto: CreateUserDto & { role: string }) {
    const user = await this.usersService.createUser(createUserDto as any);
    const { password, ...rest } = user as any;
    return rest;
  }

  @Get()
  findAll() {
    return this.usersService.users({}).then((list) => list.map((u: any) => {
      const { password, ...rest } = u as any;
      return rest;
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id }).then((u) => {
      if (!u) return u;
      const { password, ...rest } = u as any;
      return rest;
    });
  }

  /*   @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser({
      where: { id: Number(id) },
      data: updateUserDto,
    });
  } */

  //@UseGuards(AuthGuard, RolesGuard)
  //@Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser({ where: { id }, data: updateUserDto });
  }

  //@UseGuards(AuthGuard, RolesGuard)
  //@Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser({ id});
  }


  @Get('listarBorrados')
  borrados() {
    return this.usersService.borrados({}).then((list) => list.map((u: any) => {
      return u;
    }));
  }

}
