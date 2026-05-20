import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';

import * as bcrypt from 'bcrypt';

//para email
import { MailService } from 'src/mail/mail.service';
import { randomUUID } from 'crypto';

import { Role } from 'src/generated/prisma/enums';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateStaffDto } from './dto/create-staff.dto';
import { request } from 'express';

import { Request } from 'express';
import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private auditService: AuditService,
  ) {}

  async register(data: any) {
    //para clientes
    const existingUser = await this.prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
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

    await this.mailService.sendVerificationEmail(user.email, token);

    return {
      message: 'Usuario registrado. Verifica tu correo.',
    };
  }

  async verifyEmail(token: string) {
    const verification = await this.prisma.emailVerification.findUnique({
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

  
  async createStaff(data: CreateStaffDto) {
    // 1. Extraemos los campos que NO pertenecen a la tabla "Users"
    const { staffType, specialty, shift, phone, ...userData } = data;

    // 2. Hasheamos la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.prisma.users.create({
      data: {
        ...userData,
        password: hashedPassword, // Sobrescribimos con la pass hasheada
        isVerified: true, // Como lo crea el Admin, lo marcamos verificado

        // 3. Usamos "staffProfile" para crear la relación en la tabla Staff
        staffProfile: {
          create: {
            staffType: staffType,
            specialty: specialty,
            shift: shift,
            phone: phone,
          },
        },
      },
      include: {
        staffProfile: true, // Para que la respuesta de Thunder Client muestre todo
      },
    });
  }
  /*   @Roles(Role.ADMIN) // Solo el Admin puede usar este método
  async createStaff(data: CreateStaffDto) {
    return this.prisma.users.create({
      data: {
        ...data,
        // El Admin elige si es GROOMER o RECEPTIONIST
        staffProfile: { create: { staffType: data.staffType } } 
      }
    });
  } */

  async signIn(
    email: string,
    password: string,
    req: Request,
  ): Promise<{ access_token: string }> {
    const user = await this.prisma.users.findUnique({
      where: { email: email },
    });

    const context = {
      userId: user?.id,
      role: user?.role,

      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    //por si tiene bloqueo, lockeduntil es de tipo date
    if (user?.lockedUntil && user.lockedUntil > new Date()) {
      /*  aqui podemos auditar que la cuenta esta bloqueada 
    await this.auditService.logAccountLocked(
      context,
      user.lockedUntil,

    ) */ throw new ForbiddenException('Cuenta bloqueada temporalmente');
    }

    //para ver si verifico el correo
    if (user?.role === 'CLIENT' && !user.isVerified) {
      throw new BadRequestException('Debes verificar tu email');
    }

    if (user?.deletedAt) {
      throw new NotFoundException(
        'No se encontró el usuario con el correo: ${email}',
      );
    }

    if (!user) {
      throw new NotFoundException('Credenciales invalidas');
    }

    //verificamos el hash de la contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    //si la contra es incorrecta aumentamos los intentos
    if (!isValidPassword) {
      const attempts = user.failedLoginAttempts + 1;

      const updateData: any = {
        failedLoginAttempts: attempts,
        lastFailedLoginAt: new Date(),
      };

      // AUDITORÍA LOGIN FALLIDO
      await this.auditService.logLoginFailed(context, attempts);

      // Bloquear al llegar al límite
      if (attempts >= 5) {
        updateData.lockedUntil = new Date(
          Date.now() + 15 * 60 * 1000, // 15 minutos de bloqueo
        );

        //audit cuenta bloqueada
        await this.auditService.logAccountLocked(
          context,
          updateData.lockedUntil,
        );
      }

      //actualizamos datos
      await this.prisma.users.update({
        where: { id: user.id },
        data: updateData,
      });

      throw new UnauthorizedException('Credenciales inválidas');
    }

    //LOGIN EXITOSO
    //si no paso nada continuamos con el login y ponemos los intentos en 0
    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastFailedLoginAt: null,
        lastLogin: new Date(),
      },
    });

    //auditamos el login exitoso
    await this.auditService.logLoginSuccess(context);

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
