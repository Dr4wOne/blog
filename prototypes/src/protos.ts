// The ten directions. `skills` and `dials` are what each one used (shown in the gallery).
export const PROTOS = [
  { id: 'p01', name: 'Essay', skills: ['design-taste-frontend', 'minimalist-ui'], variance: 3 },
  {
    id: 'p02',
    name: 'Swiss grid',
    skills: ['design-taste-frontend', 'industrial-brutalist-ui'],
    variance: 5,
  },
  {
    id: 'p03',
    name: 'Engineer’s notebook',
    skills: ['design-taste-frontend', 'minimalist-ui'],
    variance: 4,
  },
  {
    id: 'p04',
    name: 'Longform magazine',
    skills: ['design-taste-frontend', 'high-end-visual-design'],
    variance: 6,
  },
  {
    id: 'p05',
    name: 'Monochrome + one accent',
    skills: ['design-taste-frontend', 'minimalist-ui'],
    variance: 3,
  },
  { id: 'p06', name: 'Book', skills: ['design-taste-frontend', 'minimalist-ui'], variance: 3 },
  {
    id: 'p07',
    name: 'Research paper',
    skills: ['design-taste-frontend', 'minimalist-ui'],
    variance: 4,
  },
  {
    id: 'p08',
    name: 'Warm paper',
    skills: ['design-taste-frontend', 'high-end-visual-design'],
    variance: 4,
  },
  {
    id: 'p09',
    name: 'Dark-first editorial',
    skills: ['design-taste-frontend', 'minimalist-ui'],
    variance: 5,
  },
  {
    id: 'p10',
    name: 'Index-first',
    skills: ['design-taste-frontend', 'minimalist-ui'],
    variance: 6,
  },
] as const
export type ProtoId = (typeof PROTOS)[number]['id']
