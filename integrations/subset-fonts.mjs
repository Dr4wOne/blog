// After the build, cut every web font down to the characters the built pages actually contain.
// The files keep their names and URLs; variable axes are kept. Text typed into a widget that needs
// a missing glyph falls back to the metric-matched fallback face.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import subsetFont from 'subset-font'

// Always kept, so headings and UI copy can change without a font miss.
const BASE =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ‘’“”–—…·•×→←↵≈'

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

/**
 * @param {{ axes?: Record<string, Record<string, number | { min: number, max: number }>> }} [options]
 *   axes: per source file (fontsource file name without extension), the variation axes to keep, e.g.
 *   `{ 'source-serif-4-latin-wght-italic': { wght: 400 } }` pins the italic to one static weight.
 */
export default function subsetFonts({ axes = {} } = {}) {
  // dist font files are byte copies of node_modules files, so identify each one by content.
  const sources = Object.keys(axes).map((name) => {
    const pkg = name.replace(/-latin-.*$/, '')
    return {
      name,
      data: readFileSync(`node_modules/@fontsource-variable/${pkg}/files/${name}.woff2`),
    }
  })
  return {
    name: 'subset-fonts',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir)
        const files = walk(root)
        const text = new Set(BASE)
        for (const f of files.filter((f) => /\.(html|xml|json)$/.test(f))) {
          const html = readFileSync(f, 'utf8').replace(
            /<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g,
            '',
          )
          for (const ch of html
            .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
            .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(Number.parseInt(n, 16))))
            text.add(ch)
        }
        const chars = [...text].join('')
        let before = 0
        let after = 0
        for (const f of files.filter(
          (f) => f.endsWith('.woff2') && f.includes(`${join('_astro', 'fonts')}`),
        )) {
          const input = readFileSync(f)
          const match = sources.find((src) => src.data.equals(input))
          const variationAxes = match ? axes[match.name] : undefined
          const output = await subsetFont(input, chars, {
            targetFormat: 'woff2',
            ...(variationAxes ? { variationAxes } : {}),
          })
          before += input.length
          after += output.length
          writeFileSync(f, output)
        }
        logger.info(
          `fonts subset to ${text.size} characters: ${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB`,
        )
      },
    },
  }
}
