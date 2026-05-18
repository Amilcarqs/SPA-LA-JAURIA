import {Field} from '@nestjs/graphql'
import { IsEmail, IsOptional, IsString, MinLength, Matches, isString, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    name!: string;


  @Field()
  @IsEmail()
  @IsNotEmpty()
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

/*   @Field()
  @IsNotEmpty()
  @MinLength(8)
  passwordConfirm: string; */

  @IsOptional()
  @IsString()
  role?: string;
}



  