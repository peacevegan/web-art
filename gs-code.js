// Google Apps Script — deploy as Web App to log form submissions to Google Sheets.
//
// HOW TO DEPLOY (do this from YOUR Google Sheet):
// 1. Open the target Google Sheet.
// 2. Click Extensions → Apps Script.
// 3. Delete any default code, paste this entire file.
// 4. Click Deploy → New Deployment → Type: "Web app".
// 5. Set "Execute as" = Me, "Who has access" = Anyone.
// 6. Click Deploy, copy the URL ending in /exec.
// 7. Replace GOOGLE_SCRIPT_URL in index.html with this URL.
//
// IF this script is standalone (not bound to a sheet):
//    Replace the ID below with your actual spreadsheet ID and uncomment openById.

// var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

function getSheet() {
  try     { return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]; }
  catch(e){ return SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0]; }
}

function doPost(e) {
  try {
    var sheet = getSheet();
    var data;

    // Parse JSON body (fetch sends Content-Type: application/json)
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    sheet.appendRow([
      new Date(),
      data.name     || '',
      data.email    || '',
      data.phone    || '',
      data.artwork  || '',
      data.message  || '',
      data.source   || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Web App is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run this once to add column headers to the first row.
function setupHeaders() {
  getSheet().getRange(1, 1, 1, 7).setValues([['Timestamp', 'Name', 'Email', 'Phone', 'Artwork', 'Message', 'Source']]);
}
