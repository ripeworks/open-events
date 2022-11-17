const https = require("https");
const url = require("url");

const pickObjectKeys = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object[key]) obj[key] = object[key];
    return obj;
  }, {});
};

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).end();

  const { id } = req.query;
  const options = {
    host: "drive.google.com",
    path: `/uc?export=view&id=${id}`,
    headers: {},
  };
  await new Promise((resolve) => {
    https.get(options, (redirect) => {
      const { hostname, pathname } = url.parse(redirect.headers.location || "");
      https.get({ host: hostname, path: pathname }, (proxy) => {
        res.writeHead(
          proxy.statusCode,
          pickObjectKeys(proxy.headers, [
            "content-length",
            "content-type",
            "transfer-encoding",
          ])
        );
        proxy.pipe(res);
        res.on("end", () => resolve());
      });
    });
  });
};
