import { google } from "googleapis";
import credentials from "./credentials";

export async function getAuth() {
  const SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/drive",
  ];
  const auth = await google.auth.getClient({
    credentials,
    scopes: SCOPES,
  });

  return auth;
}
