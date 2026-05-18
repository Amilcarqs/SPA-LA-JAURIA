import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UsersWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prisma.users.findUnique({ where: userWhereUniqueInput });
    if (!user) return null;
    if ((user as any).deletedAt) return null;
    return user;
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UsersWhereUniqueInput;
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.users.findMany({
      where: { deletedAt: null, ...(where || {}) },
      skip,
      take,
      cursor,
      orderBy,
    });
  }

  async createUser(data: User): Promise<User> {
    const saltOrRounds = 10;
    const hashed = await bcrypt.hash(data.password, saltOrRounds);
    const payload = { ...data, password: hashed };
    return this.prisma.users.create({ data: payload });
  }

  async updateUser(params: {
    where: Prisma.UsersWhereUniqueInput;
    data: Prisma.UsersUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.users.update({
      where,
      data,
    });
  }

  async deleteUser(where: Prisma.UsersWhereUniqueInput): Promise<User> {
    return this.prisma.users.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  /*   private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ]; */

  /*   async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput
    });
  } */
  async findOne(
    userWhereUniqueInput: Prisma.UsersWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prisma.users.findUnique({ where: userWhereUniqueInput });
    if (!user) return null;
    if ((user as any).deletedAt) return null;
    return user;
  }




  //solo para borrados
  async borrados(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UsersWhereUniqueInput;
    where?: Prisma.UsersWhereInput;
    orderBy?: Prisma.UsersOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.users.findMany({
      where,
      skip,
      take,
      cursor,
      orderBy,
    });
  }
}
