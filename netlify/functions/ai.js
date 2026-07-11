// Netlify Function: Anthropic APIプロキシ
// APIキーは Netlify UI の環境変数 ANTHROPIC_API_KEY から読み込み
// ブラウザでこのURLを開くと {"ok":true} が返る＝デプロイ成功の確認になります。

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Android WebView（Origin: null）対応
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // プリフライト対応
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  // ヘルスチェック（ブラウザで開いて動作確認できる）
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, keySet: !!process.env.ANTHROPIC_API_KEY }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: event.body,
    });

    const data = await res.text();
    return {
      statusCode: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Proxy error', detail: String(err) }),
    };
  }
};
