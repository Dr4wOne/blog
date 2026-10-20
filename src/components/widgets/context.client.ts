import { budget, CATEGORIES, fmt, pct } from '../../lib/context-budget.ts'

export default function mount(root: HTMLElement) {
  const inputs = CATEGORIES.map((_, i) => root.querySelector(`#w-ctx-${i}`) as HTMLInputElement)
  const win = root.querySelector('#w-ctx-window') as HTMLInputElement
  const caveman = root.querySelector('#w-ctx-caveman') as HTMLInputElement
  const cavemanRow = root.querySelector('[data-caveman]') as HTMLElement
  const bars = [...root.querySelectorAll<HTMLElement>('.ctx-table .ctx-bar')]
  const pcts = [...root.querySelectorAll<HTMLElement>('.ctx-table .ctx-pct')]
  const totalBar = root.querySelector('.ctx-bar-total') as HTMLElement
  const total = root.querySelector('[data-total]') as HTMLElement
  const update = () => {
    const w = Number(win.value)
    const b = budget(
      inputs.map((el) => Number(el.value)),
      w,
      caveman.checked,
    )
    cavemanRow.hidden = !caveman.checked
    b.shares.forEach((s, i) => {
      bars[i]?.style.setProperty('--p', `${s * 100}%`)
      if (pcts[i]) pcts[i].textContent = pct(s)
    })
    totalBar.style.setProperty('--p', `${b.usedShare * 100}%`)
    total.textContent = `Used ${fmt(b.used)} of ${fmt(Math.max(1, w))} tokens (${pct(b.usedShare)}). Free: ${fmt(b.free)}.`
  }
  root.addEventListener('input', update)
}
