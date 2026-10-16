export default function mount(root: HTMLElement) {
  const items = [...root.querySelectorAll<HTMLLIElement>('.agent-steps li:not([data-kind=denied])')]
  const denied = root.querySelector('[data-kind=denied]') as HTMLLIElement
  const next = root.querySelector('[data-next]') as HTMLButtonElement
  const approve = root.querySelector('[data-approve]') as HTMLButtonElement
  const deny = root.querySelector('[data-deny]') as HTMLButtonElement
  const live = root.querySelector('[data-live]') as HTMLElement
  let shown = 1

  const render = (stopped = false) => {
    items.forEach((li, i) => {
      li.hidden = i >= shown
    })
    denied.hidden = !stopped
    const last = items[shown - 1]
    const waiting = !stopped && last?.dataset.kind === 'approve'
    const finished = stopped || shown >= items.length
    next.hidden = waiting || finished
    approve.hidden = deny.hidden = !waiting
    const current = stopped ? denied : last
    live.textContent = current ? (current.textContent ?? '').replace(/\s+/g, ' ').trim() : ''
  }
  next.addEventListener('click', () => {
    shown = Math.min(shown + 1, items.length)
    render()
    if (!next.hidden) next.focus()
    else (approve.hidden ? root.querySelector<HTMLButtonElement>('[data-reset]') : approve)?.focus()
  })
  approve.addEventListener('click', () => {
    shown += 1
    render()
    next.focus()
  })
  deny.addEventListener('click', () => {
    render(true)
    root.querySelector<HTMLButtonElement>('[data-reset]')?.focus()
  })
  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    shown = 1
    render()
    next.focus()
  })
  render()
}
