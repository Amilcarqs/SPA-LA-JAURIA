// esto aun no funciona, no se por que, pero es para crear un usuario admin por defecto, para poder entrar al panel de admin y crear los usuarios de personal, etc

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 seed...');

  await prisma.users.create({
    data: {
      name: 'Admin',
      email: 'admin@spa.com',
      password: await bcrypt.hash('Admin.1', 10),
      role: Role.ADMIN,
      isVerified: true,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });