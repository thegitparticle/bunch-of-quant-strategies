const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const url = require('url')

const port = process.env.PORT ? Number(process.env.PORT) : 5173
const rootDir = __dirname

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400)
    res.end('Bad request')
    return
  }

  const { pathname, query } = url.parse(req.url, true)

  // Proxy candle requests to Hyperliquid
  if (pathname === '/api/candles') {
    const coin = query.coin || 'BTC'
    const interval = query.interval || '4h'
    const days = parseInt(query.days || '300', 10)
    const now = Date.now()
    const startTime = now - days * 24 * 60 * 60 * 1000

    const body = JSON.stringify({
      type: 'candleSnapshot',
      req: { coin, interval, startTime, endTime: now },
    })

    const options = {
      hostname: 'api.hyperliquid.xyz',
      path: '/info',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }

    const proxyReq = https.request(options, (proxyRes) => {
      let data = ''
      proxyRes.on('data', (chunk) => (data += chunk))
      proxyRes.on('end', () => {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        })
        res.end(data)
      })
    })

    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: err.message }))
    })

    proxyReq.write(body)
    proxyReq.end()
    return
  }

  // Static file serving
  const safePath = pathname === '/' ? '/index.html' : pathname
  const filePath = path.join(rootDir, decodeURIComponent(safePath))

  if (!filePath.startsWith(rootDir)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }

    const ext = path.extname(filePath)
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' })
    res.end(data)
  })
})

server.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}`)
})
