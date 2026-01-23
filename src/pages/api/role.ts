// src/pages/api/role.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const session = await getSession({ req });
      const userId = session?.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Ambil roles dari tabel role melalui relasi user
      const userWithRoles = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          roles: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!userWithRoles || userWithRoles.roles.length === 0) {
        return res.status(404).json({ error: 'No roles found for this user' });
      }

      res.status(200).json(userWithRoles.roles);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
      } else {
        console.error("An unknown error occurred:", error);
      }
      return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
