import { useId } from 'react';
import { FOOD_IMAGES } from '../data/foodImages';
import type { FoodArt } from '../types/game';

// Each viewBox selects an individual illustration from the transparent atlas.
// Tight bounds keep neighbouring food sprites out of the visible artwork.
const bounds: Record<FoodArt, [number, number, number, number]> = {
  porridge: [33, 76, 291, 258], toast: [338, 83, 297, 254], yogurt: [654, 82, 286, 252],
  pancakes: [30, 358, 296, 275], bowl: [335, 369, 306, 264], soup: [654, 373, 293, 258],
  salad: [28, 652, 295, 272], pasta: [329, 676, 326, 234], burger: [664, 654, 277, 269],
  wrap: [28, 954, 301, 270], smoothie: [388, 909, 203, 329], cake: [639, 944, 319, 289],
  fruit: [23, 1247, 288, 300], fish: [318, 1274, 354, 262],
};

export function FoodIllustration({ type, foodId, vegetableToast = false }: { type: FoodArt; foodId?: string; vegetableToast?: boolean }) {
  const clipId = useId();
  const image = foodId && Object.hasOwn(FOOD_IMAGES, foodId) ? FOOD_IMAGES[foodId] : undefined;
  if (image) return <img className={`food-illustration art-${foodId}`} src={image} alt="" aria-hidden="true" draggable={false} />;
  const [x, y, width, height] = bounds[type];
  if (vegetableToast && type === 'toast') return <img className="food-illustration art-vegetable-toast" src="/art/vegetable-toast.webp" alt="" aria-hidden="true" draggable={false} />;
  return <svg className={`food-illustration art-${type}`} viewBox={bounds[type].join(' ')} aria-hidden="true" focusable="false">
    <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
    <image href="/art/food-atlas.webp" width="972" height="1619" clipPath={`url(#${clipId})`} />
  </svg>;
}
