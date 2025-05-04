let cachedAccessToken = null;
let accessTokenExpiry = 0; // Unix time (秒)

function _getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  
  // キャッシュされたトークンが存在し、かつ有効期限が切れていない場合は再利用
  if (cachedAccessToken && accessTokenExpiry > now + 60) { // 念のため、60秒のバッファを持たせる
    Logger.log("キャッシュされた認証トークンを利用");
    return cachedAccessToken;
  }
  Logger.log("認証トークンを取得");

  const privateKeyString = PropertiesService.getScriptProperties().getProperty('private_key');
  const clientEmail = PropertiesService.getScriptProperties().getProperty('client_email');

  const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT'
  };
  var scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/firebase.database'
  ];
  const jwtClaim = {
    iss: clientEmail,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + (60 * 60), // 1時間有効
  };
  const jwt = Utilities.base64EncodeWebSafe(JSON.stringify(jwtHeader)) + '.' +
              Utilities.base64EncodeWebSafe(JSON.stringify(jwtClaim));

  const privateKeyLineBreaked = privateKeyString.replace(/\\n/g, '\n');
  const signature = Utilities.computeRsaSha256Signature(jwt, privateKeyLineBreaked);
  const signedJwt = jwt + '.' + Utilities.base64EncodeWebSafe(signature);

  const grantType = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
  const payload = `grant_type=${encodeURIComponent(grantType)}&assertion=${signedJwt}`;

  const tokenResponse = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    payload: payload
  });

  const tokenData = JSON.parse(tokenResponse.getContentText());
  cachedAccessToken = tokenData.access_token;
  accessTokenExpiry = now + tokenData.expires_in; // expires_in は秒単位

  return cachedAccessToken;
}

function getAuthHeader() {
  return {'Authorization': 'Bearer ' + _getAccessToken()};
}
