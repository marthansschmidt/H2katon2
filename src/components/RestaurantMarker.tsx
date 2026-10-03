import type { Restaurant } from '../types/game';
import type { MapMarkerPosition } from './mapLayout';
export function RestaurantMarker({ restaurant, position, disabled = false, onSelect }: { restaurant: Restaurant; position?: MapMarkerPosition; disabled?: boolean; onSelect: (restaurant: Restaurant) => void }) {
  return <button className="restaurant-marker" disabled={disabled} style={{ left: position?.x ?? '50%', top: position?.y ?? '50%', visibility: position ? 'visible' : 'hidden' }} data-building={position?.building} onClick={() => onSelect(restaurant)} aria-label={`Vali söögikoht ${restaurant.name}`}><span className="marker-pin" style={{ backgroundColor: restaurant.logoBackground }}><img className="restaurant-logo" src={restaurant.logo} alt="" draggable={false} /></span></button>;
}
