import {google} from "googleapis";
import asyncBusboy from "async-busboy";
import { getAuth } from "../../../google";

export default async function(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const auth = await getAuth();
  const drive = google.drive({ version: "v3", auth });
  const { files } = await asyncBusboy(req);
  const [file] = files;
  const extension = file.filename.split(".").pop();

  const driveFile = await drive.files.create({
    requestBody: {
      name: file.filename,
    },
    media: {
      mediaType: `image/${extension}`,
      body: file,
    },
    fields: "id, webViewLink",
  });

  await drive.permissions.create({
    fileId: driveFile.data.id,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return res.json(driveFile.data);
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
