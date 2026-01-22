import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const session = await getSession({ req });
      const userId  =session?.userId; 

      const userRoles = await prisma.userRole.findMany({
        where: {
          userId: String(userId), 
        },
        select: {
          role: true, 
        },
      });

      if (userRoles.length === 0) {
        return res.status(404).json({ error: 'No roles found for this user' });
      }

      res.status(200).json(userRoles);
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
