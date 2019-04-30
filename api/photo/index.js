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

  const file = await drive.files.create({
    resource: {
      name: "photo.jpg"
    },
    media: {
      mimeType: "image/jpeg",
      body: files[0]
    },
    fields: "id, webViewLink"
  });

  return file.data;
};
