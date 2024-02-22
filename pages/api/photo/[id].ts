import { NextApiRequest, NextApiResponse } from "next";

const https = require("https");

const pickObjectKeys = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object[key]) obj[key] = object[key];
    return obj;
  }, {});
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const { id } = req.query;
  const options = {
    host: "drive.google.com",
    path: `/uc?export=view&id=${id}`,
    headers: {},
  };

  await new Promise<void>((resolve) => {
    https.get(options, (redirect) => {
      https.get(redirect.headers.location, (proxy) => {
        res.writeHead(proxy.statusCode, {
          ...pickObjectKeys(proxy.headers, [
            "content-length",
            "content-type",
            "transfer-encoding",
          ]),
          "cache-control":
            proxy.statusCode === 200
              ? "public, max-age=31536000, immutable"
              : proxy.headers["cache-control"],
        });
        proxy.pipe(res);
        res.on("end", () => resolve());
      });
    });
  });
}
