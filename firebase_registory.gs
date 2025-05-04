const DATABASE_URL = PropertiesService.getScriptProperties().getProperty('database_url');
const TARGET_URL = `${DATABASE_URL}/messages.json`;

/* ********************
 * 認証あり
 ******************** */

function readData() {
  const options = {
    method: 'GET',
    headers: getAuthHeader()
  };
  const response = UrlFetchApp.fetch(TARGET_URL, options);
  const data = JSON.parse(response.getContentText());
  Logger.log(data);
  return data;
}

function addData() {
  const payload = {
      userid: 1000,
      text: "チャットメッセージ3",
      unixtime: Date.now()
  };
  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    headers: getAuthHeader()
  };
  UrlFetchApp.fetch(TARGET_URL, options);
}

/* ********************
 * 認証なし
 ******************** */

function readDataWithoutAuth() {
  const response = UrlFetchApp.fetch(TARGET_URL);
  const data = JSON.parse(response.getContentText());
  Logger.log(data);
}

function writeDataWithoutAuth() {
  const payload = {
    user3: {
      username: "anotheruser3",
      email: "another3@example.com"
    }
  };
  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };
  UrlFetchApp.fetch(TARGET_URL, options);
}
