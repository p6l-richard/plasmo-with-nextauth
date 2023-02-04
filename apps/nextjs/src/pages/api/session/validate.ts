import { NextApiHandler } from "next";
import { z } from "zod";
import { prisma } from "@acme/db";

import { cors, runMiddleware } from "~/utils/cors";

const handler: NextApiHandler = async (req, res) => {
  // run the cors middleware to allow requests from the extension
  await runMiddleware(req, res, cors);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const inputValidation = z.object({ token: z.string() }).safeParse(req.body);
  if (!inputValidation.success) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken: inputValidation.data.token },
  });

  if (session && session.expires >= new Date()) {
    return res.status(200).json({ message: "success" });
  }
  return res.status(401).json({ message: "Unauthorized" });
};
export default handler;
