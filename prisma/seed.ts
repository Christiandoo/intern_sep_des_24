// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  // ROLES
  await prisma.role.createMany({
    data: [
      { id: 'ADMIN', name: 'Admin' },
      { id: 'SPECIALIST', name: 'Specialist' },
      { id: 'MANAGER', name: 'Manager' },
    ],
    skipDuplicates: true,
  })

  // USERS
  await prisma.user.createMany({
    data: [
      {
        id: 'user-admin',
        email: 'digital@gmail.com',
        username: 'admin',
        passwordHash: password,
        updatedAt: new Date(),
      },
      {
        id: 'user-specialist',
        email: 'specialist@gmail.com',
        username: 'specialist',
        passwordHash: password,
        updatedAt: new Date(),
      },
      {
        id: 'user-manager',
        email: 'manager@gmail.com',
        username: 'manager',
        passwordHash: password,
        updatedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  })

  // USER ↔ ROLE
  await prisma.user.update({
    where: { id: 'user-admin' },
    data: {
      roles: {
        connect: [{ id: 'ADMIN' }],
      },
    },
  })

  await prisma.user.update({
    where: { id: 'user-specialist' },
    data: {
      roles: {
        connect: [{ id: 'SPECIALIST' }],
      },
    },
  })

  await prisma.user.update({
    where: { id: 'user-manager' },
    data: {
      roles: {
        connect: [{ id: 'MANAGER' }],
      },
    },
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
