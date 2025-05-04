function expandToSpreadsheet(json) {
  const sheet = SpreadsheetApp.getActiveSheet();

  // ヘッダー行
  const header = ['hash', 'send time(JST)', 'text', 'userid'];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(header);
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
