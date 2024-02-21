import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "universal-cookie";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.AUTH_PASSWORD) {
    return res.status(200).json({ hasAccess: true });
  }

  const cookies = new Cookies(req.headers.cookie);
  const password = cookies.get("open-event-mod-auth") ?? "";

  return res.status(200).json({
    hasAccess: password === process.env.AUTH_PASSWORD,
  });
}
