import type { MealTime } from '../types/game';

export const MAP_SCENES: Record<MealTime, { src: string; alt: string }> = {
  breakfast: {
    src: '/art/tartu-map-morning.webp',
    alt: 'Tartu kaart hommiku koiduvalguses: ajaloolised majad keskel ja Emajõgi paremas servas',
  },
  lunch: {
    src: '/art/tartu-map-noon-v2.webp',
    alt: 'Tartu kaart heledas keskpäevavalguses: ajaloolised majad keskel ja Emajõgi paremas servas',
  },
  dinner: {
    src: '/art/tartu-map-night.webp',
    alt: 'Tartu kaart hilisõhtul: majades helendavad aknad, tänavalaternad ja Emajõe peegeldused',
  },
};
