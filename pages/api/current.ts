import { NextApiRequest, NextApiResponse } from 'next';

import serverAuth from '@/libs/serverAuth';

const API_KEY = process.env.API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {

    const apiKey = req.headers['x-api-key'];

    // Check if the API key is present and correct
    if (!apiKey || apiKey !== API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentUser } = await serverAuth(req, res);

    return res.status(200).json(currentUser);
  } catch (error) {
    //console.log(error);
    return res.status(400).end();
  }
}