// Build-time Open Graph images (1200×630 PNG) in the site's own type: satori draws, resvg rasterises.
import { readFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import subsetFont from 'subset-font'

const SRC =
  './node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2'
let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 600; style: 'normal' }[]> | undefined

// satori reads TTF/OTF/WOFF but not woff2 or variable axes, so pin each weight into a static TTF.
function load() {
  fonts ??= (async () => {
    const src = readFileSync(SRC)
    const chars =
      Array.from({ length: 0x24f - 0x20 }, (_, i) => String.fromCodePoint(0x20 + i)).join('') +
      '‘’“”–—…·'
    const pin = async (wght: 400 | 600) => ({
      name: 'Source Serif',
      weight: wght,
      style: 'normal' as const,
      data: (await subsetFont(src, chars, {
        targetFormat: 'truetype',
        variationAxes: { wght },
      })) as Buffer,
    })
    return Promise.all([pin(400), pin(600)])
  })()
  return fonts
}

const h = (type: string, style: Record<string, unknown>, children: unknown) => ({
  type,
  props: { style, children },
})

export async function ogImage(opts: { title: string; kicker: string; footer: string }) {
  const svg = await satori(
    h(
      'div',
      {
        width: 1200,
        height: 630,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: '#fafafa',
        color: '#17171a',
        fontFamily: 'Source Serif',
      },
      [
        h('div', { fontSize: 30, color: '#55545a' }, opts.kicker),
        h(
          'div',
          {
            fontSize: opts.title.length > 40 ? 76 : 96,
            fontWeight: 600,
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
          },
          opts.title,
        ),
        h('div', { display: 'flex', justifyContent: 'space-between', fontSize: 30 }, [
          h('div', { fontWeight: 600 }, 'dr4w'),
          h('div', { color: '#1b4d89' }, opts.footer),
        ]),
      ],
    ) as never,
    { width: 1200, height: 630, fonts: await load() },
  )
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
}
