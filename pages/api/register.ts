import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/libs/prismadb';

//@ts-ignore
import md5 from 'md5'; // Import the md5 library for Gravatar email hashing

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, username, name, password } = req.body;

  if (name.toLowerCase().includes('adjma') || username.toLowerCase().includes('adjma')) {
    return res.status(400).end();
  }

  try {
    //const { email, username, name, password } = req.body;

    // Calculate Gravatar URL
    const gravatarHash = md5(email.trim().toLowerCase());
    const gravatarUrl = `https://www.gravatar.com/avatar/${gravatarHash}?d=identicon&s=200`;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        hashedPassword,
        profileImage: gravatarUrl,  // Add Gravatar image URL to the user creation
      }
    });

    return res.status(200).json(user);
  } catch (error) {
    //console.log(error);
    return res.status(400).end();
  }
}
