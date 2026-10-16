// node crop.mjs <img> <outPrefix> <sliceHeight> [maxSlices] — cut a tall screenshot into viewable slices.
import sharp from 'sharp'

const [img, out, h = '1800', max = '40'] = process.argv.slice(2)
const meta = await sharp(img).metadata()
const n = Math.min(+max, Math.ceil(meta.height / +h))
for (let i = 0; i < n; i++) {
  const top = i * +h
  await sharp(img)
    .extract({ left: 0, top, width: meta.width, height: Math.min(+h, meta.height - top) })
    .jpeg({ quality: 60 })
    .toFile(`${out}-${String(i).padStart(2, '0')}.jpg`)
}
console.log(meta.width, meta.height, n)
