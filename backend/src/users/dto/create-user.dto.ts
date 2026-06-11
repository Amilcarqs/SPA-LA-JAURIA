import { IsEmail, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
  message:
    'La contraseña debe tener mayúscula, minúscula, número, carácter especial y mínimo 8 caracteres',
  })
  password!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  role?: Role;
}
