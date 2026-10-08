import type { Restaurant } from '../types/game';

export function RestaurantLogo({ restaurant }: { restaurant: Restaurant }) {
  const tone = ['supilinna', 'vanalinna', 'maitsed'].includes(restaurant.id) ? 'dark'
    : restaurant.id === 'ulikooli' ? 'gold' : 'brand';
  return <img className="restaurant-logo" data-tone={tone} src={restaurant.logo} alt="" aria-hidden="true" draggable={false} />;
}
