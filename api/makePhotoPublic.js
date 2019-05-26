const { google } = require("googleapis");
const credentials = require("./credentials.json");

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

const main = async fileId => {
  const auth = await google.auth.getClient({
    credentials,
    scopes: SCOPES
  });
  const drive = google.drive({ version: "v3", auth });

  const files = await drive.files.list();
  // console.log(files.data.files);

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

// TODO loop through all photos and make public

main(process.argv[2]);
