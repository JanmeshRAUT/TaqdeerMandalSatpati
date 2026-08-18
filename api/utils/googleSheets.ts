import { google } from 'googleapis';

// Use environment variables for the credentials
const getAuth = () => {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  // Replace actual literal '\n' characters in the env var string with actual newlines
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    return null;
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
};

export const appendToGoogleSheet = async (
  range: string, 
  values: any[][]
): Promise<boolean> => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const auth = getAuth();

    if (!spreadsheetId || !auth) {
      console.log('Google Sheets Sync skipped: Credentials or Spreadsheet ID not configured.');
      return false; // Skip silently if not configured
    }

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range, // e.g., 'Bookings!A:I' or 'Donations!A:J'
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log(`Successfully appended ${values.length} rows to ${range}`);
    return true;
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    return false;
  }
};
