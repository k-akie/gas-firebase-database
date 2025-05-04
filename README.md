# gas-firebase-database
Google App Scripts から Firebase Realtime Database を利用する 

# 使い方
このスクリプトを利用するには、以下の手順に従って Firebase プロジェクトの設定と Apps Script の準備を行う。

## Firebase プロジェクトの準備
1. Firebase プロジェクトを作成し、Realtime Database を作成する
3. サービスアカウントの秘密鍵の生成
   - Firebase Console の左側のメニューから「Project settings」（プロジェクトの設定）を開く
   - 上部のタブから「Service accounts」（サービスアカウント）を選択
   - 「Generate new private key」（新しい秘密鍵を生成）ボタンをクリックし、秘密鍵の JSON ファイルをダウンロードする

## Google Apps Script の設定
1. スクリプト プロパティの登録
   - Google Apps Script のプロジェクトを開く
   - 「Project properties」（プロジェクトの設定）を選択する
   - 「Script properties」（スクリプト プロパティ）で、以下のキーと値のペアを登録する
     - `client_email`: 秘密鍵 JSON ファイル内の `"client_email"` の値
     - `private_key`: 秘密鍵 JSON ファイル内の `"private_key"` の値
     - `database_url`: Firebase Realtime Database の URL（`https://<your-project-id>.firebaseio.com/` のような形式）
