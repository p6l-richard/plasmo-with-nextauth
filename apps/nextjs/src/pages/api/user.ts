import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { prisma } from "@acme/db";

import { cors, runMiddleware } from "~/utils/cors";
import { env } from "~/env.mjs";

// return the user
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // run the cors middleware to allow requests from the extension
  await runMiddleware(req, res, cors);

  const token = await getToken({ req, secret: env.NEXTAUTH_SECRET, raw: true });
  if (!token) {
    return res.status(404).json({ message: "Not Found" });
  }
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
    include: { user: true },
  });

  if (!session || session.expires < new Date()) {
    // The token is expired
    return res
      .status(401)
      .json({ message: "Unauthorized. The token expired." });
  }

  return res.status(200).json(session.user);
}
