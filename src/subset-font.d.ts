// subset-font ships no types; this is the part of its API the build uses.
declare module 'subset-font' {
  export default function subsetFont(
    font: Buffer,
    text: string,
    options?: {
      targetFormat?: 'woff2' | 'woff' | 'truetype' | 'sfnt'
      variationAxes?: Record<string, number | { min: number; max: number }>
    },
  ): Promise<Buffer>
}
