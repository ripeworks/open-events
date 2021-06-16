const https = require("https");
const url = require("url");
const { google } = require("googleapis");
const asyncBusboy = require("async-busboy");
const { send } = require("micro");
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const pickObjectKeys = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object[key]) obj[key] = object[key];
    return obj;
  }, {});
};

module.exports = async (req, res) => {
  // support image proxy
  if (req.method === "GET") {
    const { id } = req.query;
    const options = {
      host: "drive.google.com",
      path: `/uc?export=view&id=${id}`,
      headers: {},
    };
    await new Promise((resolve) => {
      https.get(options, (redirect) => {
        const { hostname, pathname } = url.parse(redirect.headers.location);
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
    return;
  }

  const auth = await google.auth.getClient({
    credentials,
    scopes: SCOPES,
  });
  const drive = google.drive({ version: "v3", auth });
  const { files } = await asyncBusboy(req);
  const [file] = files;
  const extension = file.filename.split(".").pop();

  const driveFile = await drive.files.create({
    resource: {
      name: file.filename,
    },
    media: {
      mimeType: `image/${extension}`,
      body: file,
    },
    fields: "id, webViewLink",
  });

  await drive.permissions.create({
    fileId: driveFile.data.id,
    resource: {
      role: "reader",
      type: "anyone",
    },
  });

  send(res, 200, driveFile.data);
};
