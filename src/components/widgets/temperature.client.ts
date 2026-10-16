import { CANDIDATES, probabilities, sample } from '../../lib/temperature.ts'

export default function mount(root: HTMLElement) {
  const slider = root.querySelector('input[type=range]') as HTMLInputElement
  const bars = [...root.querySelectorAll<HTMLElement>('.temp-bar')]
  const pcts = [...root.querySelectorAll<HTMLElement>('.temp-pct')]
  const out = root.querySelector('[data-samples]') as HTMLElement
  let probs = probabilities(1)
  const update = () => {
    const t = Number(slider.value)
    probs = probabilities(t)
    for (const el of root.querySelectorAll('[data-t]')) el.textContent = t.toFixed(1)
    probs.forEach((p, i) => {
      bars[i]?.style.setProperty('--p', `${p * 100}%`)
      if (pcts[i]) pcts[i].textContent = `${(p * 100).toFixed(p < 0.1 ? 1 : 0)}%`
    })
  }
  slider.addEventListener('input', update)
  root.querySelector('[data-sample]')?.addEventListener('click', () => {
    const words = Array.from({ length: 10 }, () => CANDIDATES[sample(probs, Math.random())]?.[0])
    out.textContent = `${slider.value === '0' ? 'Greedy' : 'Sampled'}: ${words.join(', ')}`
  })
}
