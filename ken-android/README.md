# 健康オタク・ケン — Android版（Expo WebViewラッパー）

単一HTMLのアプリをそのままAndroidアプリ化する構成です。HTMLはアプリ内に同梱されるため、オフラインでも起動します（AI機能とCDN読み込みのみ通信が必要）。

## 構成

```
ken-android/
├── App.js                  ← WebViewラッパー本体
├── app.json                ← Expo設定（パッケージ名など）
├── eas.json                ← EAS Buildの設定
├── package.json
├── assets/
│   └── app.html            ← アプリ本体（API呼び出しをAI_ENDPOINTに変更済み）
└── netlify/functions/
    └── ai.js               ← Anthropic APIプロキシ（CORS対応版）
```

## 事前準備（1箇所だけ書き換え）

`assets/app.html` の先頭付近にある `AI_ENDPOINT` を、あなたのNetlifyサイトのURLに書き換えてください：

```js
const AI_ENDPOINT = 'https://ken-app.netlify.app/.netlify/functions/ai';
```

※ `netlify/functions/ai.js` は既存のプロキシと差し替えてOKです。AndroidのWebViewからのリクエストは `Origin: null` になるため、CORSを `*` で許可するこのバージョンが必要です。`ANTHROPIC_API_KEY` はNetlifyのUIで設定済みなのでそのまま使えます。

## ビルド手順

```bash
# 1. 依存関係のインストール
npm install

# 2. 実機で動作確認（Expo Goアプリで読み取り）
npx expo start

# 3. テスト用APKビルド
npx eas build -p android --profile preview

# 4. Google Play提出用AABビルド
npx eas build -p android --profile production
```

## アイコンについて

`assets/adaptive-icon.png`（1024x1024推奨、透過PNG）を用意してください。仮アイコンでよければ app.json の adaptiveIcon 設定を一旦削除してもビルドは通ります。

## 注意点

- **localStorage**: `domStorageEnabled` を有効にしているのでデータは端末内に保存されます。ただしアプリをアンインストールすると消えます。
- **CDN依存**: Chart.jsとTablerアイコンはCDN読み込みのため、初回表示にはネット接続が必要です。完全オフライン化したい場合はHTML内に埋め込む対応が可能です。
- **Google Play審査**: 「医者を目指す」と同様、クローズドテスト（12名・14日間）の要件があります。プライバシーポリシーURLも必要です。
