import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';

const API_KEY = process.env.API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  //const APP_API_KEY = process.env.APP_API_KEY;

  try {
    const apiKey = req.headers['x-api-key'];

    // Check if the API key is present and correct
    if (!apiKey || apiKey !== API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json(users);
  } catch(error) {
    //console.log(error);
    return res.status(400).end();
  }
}