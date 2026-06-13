/**
 * Demo dataset — fictional but realistic figures, modelled on the
 * Météo-France / DEAL Guadeloupe sargassum surveillance bulletins.
 */

export type AlertLevel = 0 | 1 | 2 | 3

export interface StrandingSite {
  id: string
  name: string
  commune: string
  lon: number
  lat: number
  level: AlertLevel
  /** Estimated stranded volume over the last 7 days, in cubic metres. */
  volumeM3: number
  trend: 'up' | 'down' | 'stable'
  note: string
}

export const LEVELS: Record<AlertLevel, { label: string; cssVar: string }> = {
  0: { label: 'Nul', cssVar: 'var(--color-lvl0)' },
  1: { label: 'Faible', cssVar: 'var(--color-lvl1)' },
  2: { label: 'Modéré', cssVar: 'var(--color-lvl2)' },
  3: { label: 'Massif', cssVar: 'var(--color-lvl3)' },
}

export const BULLETIN = {
  number: '2026-23',
  date: 'Vendredi 12 juin 2026',
  week: 'Semaine 24',
  next: 'Prochain bulletin : lundi 15 juin',
}

export const SITES: StrandingSite[] = [
  {
    id: 'capesterre-be',
    name: 'Capesterre-Belle-Eau',
    commune: 'Basse-Terre · côte au vent',
    lon: -61.553,
    lat: 16.043,
    level: 3,
    volumeM3: 480,
    trend: 'up',
    note: 'Radeaux denses en baie de Sainte-Marie, opérations de ramassage en cours.',
  },
  {
    id: 'saint-francois',
    name: 'Saint-François',
    commune: 'Grande-Terre · côte sud',
    lon: -61.268,
    lat: 16.25,
    level: 3,
    volumeM3: 410,
    trend: 'up',
    note: 'Accumulations importantes du lagon à la pointe des Châteaux.',
  },
  {
    id: 'desirade',
    name: 'Beauséjour',
    commune: 'La Désirade',
    lon: -61.05,
    lat: 16.318,
    level: 3,
    volumeM3: 350,
    trend: 'up',
    note: 'Front exposé plein est, échouage continu depuis cinq jours.',
  },
  {
    id: 'sainte-anne',
    name: 'Sainte-Anne',
    commune: 'Grande-Terre · côte sud',
    lon: -61.38,
    lat: 16.222,
    level: 2,
    volumeM3: 240,
    trend: 'up',
    note: 'Bancs visibles au large du bourg, arrivages par épisodes.',
  },
  {
    id: 'capesterre-mg',
    name: 'Capesterre-de-Marie-Galante',
    commune: 'Marie-Galante · côte est',
    lon: -61.218,
    lat: 15.898,
    level: 2,
    volumeM3: 230,
    trend: 'stable',
    note: 'Plage de la Feuillère touchée, dépôts stabilisés.',
  },
  {
    id: 'goyave',
    name: 'Goyave',
    commune: 'Basse-Terre · côte au vent',
    lon: -61.571,
    lat: 16.131,
    level: 2,
    volumeM3: 210,
    trend: 'up',
    note: 'Échouages réguliers sur l’anse de Sainte-Claire.',
  },
  {
    id: 'moule',
    name: 'Le Moule',
    commune: 'Grande-Terre · côte atlantique',
    lon: -61.346,
    lat: 16.333,
    level: 2,
    volumeM3: 190,
    trend: 'down',
    note: 'Houle d’est en baisse, dépôts en recul sur la baie.',
  },
  {
    id: 'trois-rivieres',
    name: 'Trois-Rivières',
    commune: 'Basse-Terre · côte sud',
    lon: -61.638,
    lat: 15.972,
    level: 2,
    volumeM3: 175,
    trend: 'stable',
    note: 'Anse Duquéry concernée, embarcadère des Saintes dégagé.',
  },
  {
    id: 'grand-bourg',
    name: 'Grand-Bourg',
    commune: 'Marie-Galante · côte sud',
    lon: -61.313,
    lat: 15.883,
    level: 1,
    volumeM3: 95,
    trend: 'down',
    note: 'Dépôts épars, nettoyage hebdomadaire suffisant.',
  },
  {
    id: 'gosier',
    name: 'Le Gosier',
    commune: 'Grande-Terre · côte sud',
    lon: -61.488,
    lat: 16.202,
    level: 1,
    volumeM3: 85,
    trend: 'down',
    note: 'Îlet du Gosier épargné, filaments isolés sur les plages.',
  },
  {
    id: 'terre-de-haut',
    name: 'Terre-de-Haut',
    commune: 'Les Saintes',
    lon: -61.582,
    lat: 15.866,
    level: 1,
    volumeM3: 70,
    trend: 'stable',
    note: 'Baie de Marigot légèrement touchée, bourg épargné.',
  },
  {
    id: 'petit-bourg',
    name: 'Petit-Bourg',
    commune: 'Basse-Terre · côte au vent',
    lon: -61.588,
    lat: 16.192,
    level: 1,
    volumeM3: 60,
    trend: 'stable',
    note: 'Viard et Pointe-à-Bacchus sous surveillance.',
  },
  {
    id: 'anse-bertrand',
    name: 'Anse-Bertrand',
    commune: 'Grande-Terre · côte nord',
    lon: -61.503,
    lat: 16.472,
    level: 0,
    volumeM3: 0,
    trend: 'stable',
    note: 'Aucun échouage observé cette semaine.',
  },
]

/** Daily stranded volume across the archipelago, m³/day, oldest first (14 days). */
export const DAILY_TOTALS = [258, 276, 290, 301, 322, 348, 405, 310, 332, 351, 378, 396, 405, 423]

export const DAILY_LABELS = [
  '30 mai',
  '31 mai',
  '1 juin',
  '2 juin',
  '3 juin',
  '4 juin',
  '5 juin',
  '6 juin',
  '7 juin',
  '8 juin',
  '9 juin',
  '10 juin',
  '11 juin',
  '12 juin',
]

export const TOTAL_WEEK_M3 = SITES.reduce((sum, s) => sum + s.volumeM3, 0)
export const MASSIVE_COUNT = SITES.filter((s) => s.level === 3).length
export const WEEK_DELTA_PCT = 18
