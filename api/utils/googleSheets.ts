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

export const updateStatusInGoogleSheet = async (
  sheetName: 'Bookings' | 'Donations',
  searchIdentifier: string, // booking id or donation transactionId/receiptNo
  newStatus: string
): Promise<boolean> => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const auth = getAuth();
    if (!spreadsheetId || !auth) return false;

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Fetch current data to find the row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:J`,
    });

    const rows = response.data.values;
    if (!rows) return false;

    const updatePromises: Promise<any>[] = [];

    rows.forEach((row, index) => {
      const rowIndex = index + 1; // 1-indexed for Sheets
      
      if (sheetName === 'Bookings') {
        // For Bookings, ID is in Col A (index 0). Status is in Col F (index 5)
        if (row[0] === searchIdentifier) {
          updatePromises.push(
            sheets.spreadsheets.values.update({
              spreadsheetId,
              range: `${sheetName}!F${rowIndex}`,
              valueInputOption: 'USER_ENTERED',
              requestBody: { values: [[newStatus]] }
            })
          );
        }
      } else if (sheetName === 'Donations') {
        // For Donations, transactionId is in Col J (index 9) or receiptNo in Col B (index 1)
        if (row[1] === searchIdentifier || row[9] === searchIdentifier) {
          // Status is in Col I (index 8)
          updatePromises.push(
            sheets.spreadsheets.values.update({
              spreadsheetId,
              range: `${sheetName}!I${rowIndex}`,
              valueInputOption: 'USER_ENTERED',
              requestBody: { values: [[newStatus]] }
            })
          );
        }
      }
    });

    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
      console.log(`Successfully updated status in Google Sheets for ${searchIdentifier}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating Google Sheets:', error);
    return false;
  }
};
