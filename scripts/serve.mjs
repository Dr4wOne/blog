// Local static server that behaves like Cloudflare's edge for the judges: brotli, the same cache
// headers as public/_headers, directory index.html, 404.html. Usage: node scripts/serve.mjs <dir> [port]
import { existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { brotliCompressSync, constants } from 'node:zlib'

const [dir = 'dist', port = '4321'] = process.argv.slice(2)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
}
const cache = new Map()

// Cloudflare static-assets rules: `_redirects` (static rules only) and `_headers` (path patterns with *).
const read = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), 'utf8') : '')
const redirects = read('_redirects')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((l) => l.split(/\s+/))
const headerRules = []
for (const line of read('_headers').split('\n')) {
  if (!line.trim() || line.trim().startsWith('#')) continue
  if (!/^\s/.test(line))
    headerRules.push({
      re: new RegExp(
        `^${line
          .trim()
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*')}$`,
      ),
      headers: {},
    })
  else {
    const [k, ...v] = line.trim().split(':')
    headerRules.at(-1).headers[k.trim().toLowerCase()] = v.join(':').trim()
  }
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x')
  const rule = redirects.find(([from]) => from === url.pathname)
  if (rule) return res.writeHead(Number(rule[2] ?? 302), { location: rule[1] }).end()
  // Cloudflare's html_handling "auto-trailing-slash": /dir → /dir/ when /dir/index.html exists
  if (
    !url.pathname.endsWith('/') &&
    !extname(url.pathname) &&
    existsSync(join(dir, url.pathname, 'index.html'))
  )
    return res.writeHead(307, { location: `${url.pathname}/` }).end()
  let path = normalize(join(dir, decodeURIComponent(url.pathname)))
  if (!path.startsWith(normalize(dir))) return res.writeHead(400).end()
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html')
  let status = 200
  if (!existsSync(path)) {
    status = 404
    path = join(dir, '404.html')
    if (!existsSync(path)) return res.writeHead(404).end('not found')
  }
  const type = types[extname(path)] ?? 'application/octet-stream'
  const headers = {
    'content-type': type,
    'cache-control': url.pathname.startsWith('/_astro/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=0, must-revalidate',
  }
  for (const r of headerRules) if (r.re.test(url.pathname)) Object.assign(headers, r.headers)
  let body = readFileSync(path)
  if (
    /text|json|xml|svg|javascript/.test(type) &&
    /\bbr\b/.test(req.headers['accept-encoding'] ?? '')
  ) {
    const key = `${path}:${statSync(path).mtimeMs}` // rebuilt files get recompressed
    if (!cache.has(key))
      cache.set(key, brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 9 } }))
    body = cache.get(key)
    headers['content-encoding'] = 'br'
  }
  res.writeHead(status, headers).end(body)
}).listen(Number(port), () => console.log(`serving ${dir} on http://localhost:${port}`))
