const { google } = require("googleapis");
const asyncBusboy = require("async-busboy");
const { send } = require("micro");
const credentials = require("../credentials.json");

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

module.exports = async (req, res) => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: SCOPES
  });
  const drive = google.drive({ version: "v3", auth });
  const { files } = await asyncBusboy(req);
  const [file] = files;
  const extension = file.filename.split(".").pop();

  const driveFile = await drive.files.create({
    resource: {
      name: file.filename
    },
    media: {
      mimeType: `image/${extension}`,
      body: file
    },
    fields: "id, webViewLink"
  });

  await drive.permissions.create({
    fileId: driveFile.data.id,
    resource: {
      role: "reader",
      type: "anyone"
    }
  });

  send(res, 200, driveFile.data);
};
