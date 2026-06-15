interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/candles') {
      return handleCandles(url);
    }

    return new Response('Not Found', { status: 404 });
  },
};

async function handleCandles(url: URL): Promise<Response> {
  const coin = url.searchParams.get('coin') || 'BTC';
  const interval = url.searchParams.get('interval') || '4h';
  const days = parseInt(url.searchParams.get('days') || '300', 10);

  const now = Date.now();
  const startTime = now - days * 24 * 60 * 60 * 1000;

  try {
    const response = await fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'candleSnapshot',
        req: { coin, interval, startTime, endTime: now },
      }),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Hyperliquid API error', status: response.status }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
