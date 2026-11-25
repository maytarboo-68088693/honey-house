import { google } from "googleapis";

function credentialsFromEnv() {
  const encoded = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (encoded) return JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
  if (raw) return JSON.parse(raw);
  throw new Error("Missing Google service account credentials.");
}

export async function getSheetsClient() {
  const credentials = credentialsFromEnv();
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
  await auth.authorize();
  return google.sheets({ version: "v4", auth });
}

export function spreadsheetId() {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("Missing GOOGLE_SHEET_ID.");
  return id;
}

export async function readRows(range) {
  const sheets = await getSheetsClient();
  const result = await sheets.spreadsheets.values.get({ spreadsheetId: spreadsheetId(), range });
  return result.data.values || [];
}

export async function appendRows(range, values) {
  const sheets = await getSheetsClient();
  return sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId(), range,
    valueInputOption: "USER_ENTERED", insertDataOption: "INSERT_ROWS",
    requestBody: { values }
  });
}
