import { IsEmail, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { Role } from 'src/generated/prisma/enums';

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

  @IsOptional()
  @IsString()
  role?: Role;
}
