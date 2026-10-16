import { encode, type Merges } from '../../lib/bpe.ts'

const MAX_SHOWN = 400

export default async function mount(root: HTMLElement) {
  const merges: Merges = await (await fetch('/widgets/bpe.json')).json()
  const input = root.querySelector('textarea') as HTMLTextAreaElement
  const list = root.querySelector('.token-list') as HTMLOListElement
  const count = root.querySelector('[data-count]') as HTMLElement
  const chars = root.querySelector('[data-chars]') as HTMLElement
  let frame = 0
  const render = () => {
    const tokens = encode(input.value, merges)
    count.textContent = String(tokens.length)
    chars.textContent = String(input.value.length)
    list.replaceChildren(
      ...tokens.slice(0, MAX_SHOWN).map((t) => {
        const li = document.createElement('li')
        li.textContent = t.replaceAll(' ', '·').replaceAll('\n', '↵')
        return li
      }),
    )
  }
  input.readOnly = false
  input.addEventListener('input', () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(render)
  })
}
