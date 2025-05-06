const SHEET_NAME_IN = 'input';
const SHEET_NAME_OUT = 'output';

function fetchInput() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME_IN);
  if (!sheet) {
    Logger.log(`指定されたシートが見つかりませんでした: ${SHEET_NAME_IN}`);
    return;
  }

  // A列の値を参照
  const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1);
  const rowData = range.getValues();
  const values = rowData.map(row => row[0]);
  return values;
}

function expandToSpreadsheet(json) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME_OUT);
  if (!sheet) {
    Logger.log(`指定されたシートが見つかりませんでした: ${SHEET_NAME_OUT}`);
    return;
  }

  // ヘッダー行
  const header = ['hash', 'send time(JST)', 'text', 'userid'];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(header);
  }

  if (!json) {
    const rowData = [item.key, null, "Not Found", null];
    sheet.appendRow(rowData);
    return;
  }

  // unixtime でソート
  const dataArray = Object.entries(json).map(([key, value]) => ({ key, ...value }));
  dataArray.sort((a, b) => a.unixtime - b.unixtime);

  // データを1行ずつ書き込む
  dataArray.forEach(item => {
    const date = new Date(item.unixtime);
    const jst = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
    
    const text = item.text.replace(/\\n/g, '\n');

    const rowData = [item.key, jst, text, item.userid];
    sheet.appendRow(rowData);
  });

  Logger.log('JSONデータの展開が完了しました。');
}
