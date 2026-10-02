import { MapPin } from 'lucide-react';
import type { Restaurant } from '../types/game';
import { RestaurantMarker } from './RestaurantMarker';
export function TartuMap({ restaurants, onSelect }: { restaurants: Restaurant[]; onSelect: (restaurant: Restaurant) => void }) {
  return <div className="tartu-map"><div className="map-location"><MapPin size={15} /><span>Tartu, Eesti</span><span className="map-live-dot" /></div><img className="map-art" src="/art/tartu-map.webp" alt="Stiliseeritud Tartu kaart: Emajõgi, sillad, raekoda ja rohelised pargid" draggable={false} />{restaurants.map((restaurant, i) => <RestaurantMarker key={restaurant.id} restaurant={restaurant} index={i} onSelect={onSelect} />)}<div className="map-compass"><span>N</span>↑</div><span className="map-caption">Väike kaart, palju maitseid.</span></div>;
}
