import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';

import * as bcrypt from 'bcrypt';

//para email
import { MailService } from 'src/mail/mail.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(data: any){
    const existingUser = await this.prisma.users.findUnique({
      where: {
        email: data.email,
      }
    });

    if (existingUser ) {
      throw new BadRequestException('Email ya registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,

        role: 'CLIENT',

        clientProfile: {
          create: {
            phone: data.phone,
            ci: data.ci,
            address: data.address,
          },
        },
      },
    });
    
    const token = randomUUID();

    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15),
      },
    });

    await this.mailService.sendVerificationEmail(
      user.email,
      token,
    );

    return {
      message: 'Usuario registrado. Verifica tu correo.',
    };
  }




  async verifyEmail(token: string) {
    const verification =
      await this.prisma.emailVerification.findUnique({
        where: {
          token,
        },
      });

    if (!verification) {
      throw new BadRequestException('Token inválido');
    }

    if (verification.expiresAt < new Date()) {
      throw new BadRequestException('Token expirado');
    }

    await this.prisma.users.update({
      where: {
        id: verification.userId,
      },
      data: {
        isVerified: true,
      },
    });

    await this.prisma.emailVerification.delete({
      where: {
        id: verification.id,
      },
    });

    return {
      message: 'Cuenta verificada correctamente',
    };
  }



  async signIn(
    email: string, 
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.users.findUnique({
      where: { email: email } ,
    });


    //esto es para la verificacion del email
    /* if (
      user?.role === 'CLIENT' &&
      !user.isVerified
    ) {
      throw new BadRequestException(
        'Debes verificar tu email',
      );
    } */

    if (user?.deletedAt) {
      throw new NotFoundException('No se encontró el usuario con el correo: ${email}');
    }

    if (!user) {
      throw new NotFoundException('No se encontró el usuario con el correo: ${email}');
    }

    //verificamos el hash de la contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { sub: user.id , email: user.email , role: user.role};
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
