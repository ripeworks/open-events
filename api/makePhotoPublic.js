const { google } = require("googleapis");
const credentials = require("./credentials.json");

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const main = async fileId => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: SCOPES
  });
  const drive = google.drive({ version: "v3", auth });

  let files;

  if (fileId) {
    files = { data: { files: [{ id: fileId }] } };
  } else {
    files = await drive.files.list();
  }

  for (const file of files.data.files) {
    await drive.permissions.create({
      fileId: file.id,
      resource: {
        role: "reader",
        type: "anyone"
      }
    });
  }
};

main(process.argv[2]);
