import type { Restaurant } from '../types/game';
import { GroupIcon } from './Icons';
export function RestaurantMarker({ restaurant, index, onSelect }: { restaurant: Restaurant; index: number; onSelect: (restaurant: Restaurant) => void }) {
  const positions = [{ left: '19%', top: '28%' }, { left: '62%', top: '22%' }, { left: '81%', top: '48%' }, { left: '62%', top: '76%' }, { left: '24%', top: '75%' }];
  return <button className={`restaurant-marker marker-${index}`} style={positions[index]} onClick={() => onSelect(restaurant)} aria-label={`Vali söögikoht ${restaurant.name}`}><span className="marker-pin"><GroupIcon name={restaurant.icon} size={24} /><span>{index + 1}</span></span><strong>{restaurant.name}</strong><span className="marker-location">{restaurant.locationLabel}</span></button>;
}
