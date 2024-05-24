import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

const API_KEY = process.env.API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const apiKey = req.headers["x-api-key"];

    // Check if the API key is present and correct
    if (req.method !== "POST") {
      if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }

    if (req.method === "POST") {
      const { currentUser } = await serverAuth(req, res);
      const { body } = req.body;

      const post = await prisma.post.create({
        data: {
          body,
          userId: currentUser.id,
        },
      });

      return res.status(200).json(post);
    }

    if (req.method === "GET") {
      const { userId } = req.query;

      let posts;

      if (userId && typeof userId === "string") {
        posts = await prisma.post.findMany({
          where: {
            userId,
          },
          include: {
            user: true,
            comments: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else {
        posts = await prisma.post.findMany({
          include: {
            user: true,
            comments: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }
      //to put a specific post at the top
      const index = posts.findIndex(
        (obj) => obj.id === "66508cb22badac9e16214b57"
      );

      if (index !== -1) {
        const movedObject = posts.splice(index, 1)[0];
        posts.unshift(movedObject);
      } else {
        console.log("Object not found");
      }
      //end
      return res.status(200).json(posts);
    }
  } catch (error) {
    //console.log(error);
    return res.status(400).end();
  }
}
