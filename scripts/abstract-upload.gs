/**
 * ICD 2027 — Abstract Word upload with Google Sheet tracking
 *
 * Setup instructions:
 * 1. Create a new Google Sheet for tracking abstracts
 * 2. In the first row, add these column headers (A–G):
 *    Timestamp | First Name | Middle Name | Last Name | Email | File Name | File URL
 * 3. Copy the Sheet ID from the URL and paste it in SHEET_ID below
 * 4. Paste this script into your EXISTING Google Apps Script project
 * 5. Deploy → Manage deployments → Edit (pencil icon)
 * 6. Version: New version
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Deploy
 * 10. On first run, authorize Drive, Gmail, and Sheets access
 *
 * Keep the same Web App URL so the website does not need a new link.
 * The Google account must have Editor access to both the Drive folder and Sheet.
 */

const FOLDER_ID = '1syH7ApUXZRicPs-2eiUXlfnS-Ka5HnN1';
const SHEET_ID = '1GsrI6qVPGhVuo0wSheVNqf9-biqPdRF2vHrMfJgRh6I';

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ success: false, error: 'Empty request' });
    }

    const data = JSON.parse(e.postData.contents);

    if (!data.fileData || !data.fileName) {
      return json_({ success: false, error: 'Missing file' });
    }

    // Save file to Drive
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const decoded = Utilities.base64Decode(data.fileData);
    const mimeType =
      data.mimeType ||
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const blob = Utilities.newBlob(decoded, mimeType, data.fileName);
    const file = folder.createFile(blob);

    const description = [
      'ICD 2027 abstract',
      'Submitter: ' +
        [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' '),
      'Email: ' + (data.email || ''),
    ].join('\n');
    file.setDescription(description);

    // Add row to Google Sheet
    try {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
      const timestamp = new Date();
      const fileUrl = file.getUrl();

      const nextRow = sheet.getLastRow() + 1;
      sheet.getRange(nextRow, 1, 1, 7).setValues([[
        timestamp,
        data.firstName || '',
        data.middleName || '',
        data.lastName || '',
        data.email || '',
        data.fileName,
        fileUrl,
      ]]);
    } catch (sheetError) {
      // Log error but don't fail the submission if Sheet write fails
      console.error('Failed to write to Sheet: ' + sheetError);
    }

    // Send confirmation email
    if (data.email) {
      try {
        const name = data.firstName || data.lastName || 'colleague';
        MailApp.sendEmail({
          to: String(data.email),
          subject: 'ICD 2027 — Abstract received',
          body:
            'Dear ' +
            name +
            ',\n\n' +
            'Thank you. Your abstract has been received.\n\n' +
            'File: ' +
            file.getName() +
            '\n\n' +
            'Acceptance decisions will be communicated by 30 April 2027.\n\n' +
            'ICD 2027 Scientific Committee\n' +
            '11th International Congress of Dipterology',
        });
      } catch (mailError) {
        // File is already saved; do not fail the submission because of email.
        console.error('Abstract confirmation email failed: ' + mailError);
      }
    }

    return json_({ success: true, fileId: file.getId() });
  } catch (err) {
    return json_({ success: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'icd2027-abstract-upload' });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
