import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';


async function main() {
  const digitalProdigy = await prisma.role.upsert({
    where: { name: 'digital prodigy' },
    update: {},
    create: {
      name: 'digital prodigy',
    },
  });

  const specialist = await prisma.role.upsert({
    where: { name: 'specialist' },
    update: {},
    create: {
      name: 'specialist',
    },
  });

  const manager = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: {
      name: 'manager',
    },
  });

  const password = await bcrypt.hash('password123', 10);

  const users = await prisma.user.createMany({
    data: [
      {
        email: 'digital@gmail.com',
        username: 'user1',
        passwordHash: password,
      },
      {
        email: 'specialist@gmail.com',
        username: 'user2',
        passwordHash: password,
      },
      {
        email: 'manager@gmail.com',
        username: 'user3',
        passwordHash: password,
      },
    ],
    skipDuplicates: true,
  });

  const user1 = await prisma.user.findUnique({ where: { email: 'digital@gmail.com' } });
  const user2 = await prisma.user.findUnique({ where: { email: 'specialist@gmail.com' } });
  const user3 = await prisma.user.findUnique({ where: { email: 'manager@gmail.com' } });

  if (user1 && user2 && user3) {
    await prisma.userRole.createMany({
      data: [
        { userId: user1.id, roleId: digitalProdigy.id },
        { userId: user2.id, roleId: specialist.id },
        { userId: user3.id, roleId: manager.id },
      ],
    });
  } else {
    console.error("One or more users were not found. Please check the user creation process.");
  }
  console.log({ users })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
