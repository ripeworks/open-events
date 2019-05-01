const { google } = require("googleapis");
const asyncBusboy = require("async-busboy");
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

  const driveFile = await drive.files.create({
    resource: {
      name: file.filename
    },
    media: {
      mimeType: "image/jpeg",
      body: file
    },
    fields: "id, webViewLink"
  });

  return driveFile.data;
};