import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';

const API_KEY = process.env.API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid ID');
    }

    const apiKey = req.headers['x-api-key'];

    // Check if the API key is present and correct
    if (!apiKey || apiKey !== API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        hasNotification: false,
      }
    });

    return res.status(200).json(notifications);
  } catch (error) {
    //console.log(error);
    return res.status(400).end();
  }
}