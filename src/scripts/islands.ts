// Loads each widget's code only when it scrolls near the viewport. Without JS the widgets
// still show a complete, static version.
const loaders: Record<string, () => Promise<{ default: (el: HTMLElement) => unknown }>> = {
  tokenizer: () => import('../components/widgets/tokenizer.client.ts'),
  temperature: () => import('../components/widgets/temperature.client.ts'),
  agent: () => import('../components/widgets/agent.client.ts'),
  context: () => import('../components/widgets/context.client.ts'),
}

const start = async (el: HTMLElement) => {
  const load = loaders[el.dataset.widget ?? '']
  if (!load) return
  await (await load()).default(el)
  // Controls appear only once their code is running.
  for (const n of el.querySelectorAll<HTMLElement>('[data-js]')) n.hidden = false
  for (const n of el.querySelectorAll<HTMLElement>('[data-nojs]')) n.hidden = true
}

const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      io.unobserve(e.target)
      start(e.target as HTMLElement)
    }
  },
  { rootMargin: '600px 0px' },
)
for (const el of document.querySelectorAll<HTMLElement>('[data-widget]')) io.observe(el)
