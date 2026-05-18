import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Role, StaffType } from '../../generated/prisma/enums'; // Ajusta según tu ruta
import { Field } from '@nestjs/graphql';

export class CreateStaffDto {
  // Datos para la tabla Users
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
  message:
    'La contraseña debe tener mayúscula, minúscula, número, carácter especial y mínimo 8 caracteres',
  })
  password!: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role; // Aquí el Admin elige: GROOMER o RECEPTIONIST

  // Datos para la tabla Staff
  @IsEnum(StaffType)
  @IsNotEmpty()
  staffType!: StaffType;

  @IsString()
  @IsOptional()
  specialty?: string; // Ej: "Corte tijera", "Baños medicados"

  @IsString()
  @IsOptional()
  shift?: string; // Ej: "Mañana", "Tarde"

  @IsString()
  @IsOptional()
  phone?: string;
}