import { useState } from 'react';
import { Cutlery } from './Icons';
import type { Food, FoodGroupTotals, MealTime, Restaurant } from '../types/game';
import { Modal } from './Modal';
import { FoodCard } from './FoodCard';
import { MealBadge } from './MealBadge';
import { RESTAURANT_BANNERS } from '../data/restaurantBanners';
export function RestaurantModal({ restaurant, foods, totals, meal, onClose, onChoose, loading, error }: { restaurant: Restaurant; foods: Food[]; totals: FoodGroupTotals; meal: MealTime; onClose: () => void; onChoose: (food: Food) => void; loading: boolean; error: string | null }) {
  const banner = RESTAURANT_BANNERS[restaurant.id];
  const [showName, setShowName] = useState(false);
  return <Modal title={restaurant.name} headerTitle={<h2><MealBadge meal={meal} /></h2>} onClose={onClose} wide className="restaurant-modal">
    <button type="button" className={`restaurant-hero${showName ? ' is-name-visible' : ''}`} aria-label={`Söögikoha nimi: ${restaurant.name}`} aria-expanded={showName} aria-describedby={`restaurant-banner-name-${restaurant.id}`} onClick={() => setShowName(visible => !visible)} onBlur={() => setShowName(false)} onKeyDown={event => {
      if (event.key === 'Escape' && showName) { event.preventDefault(); event.stopPropagation(); setShowName(false); }
    }}>
      <img className="restaurant-art" src={banner?.src ?? '/art/tartu-day.webp'} alt={banner?.alt ?? 'Tartu raekoda ja Emajõe kaldapealne'} />
      <span className="restaurant-banner-brand" role="group" aria-label={`${restaurant.name} logo`} style={{ background: restaurant.logoBackground ?? '#fff8e7' }}>
        <img src={restaurant.logo} alt="" aria-hidden="true" />
        <span className="restaurant-name-tooltip" role="tooltip" id={`restaurant-banner-name-${restaurant.id}`}>{restaurant.name}</span>
      </span>
    </button>
    <div className="restaurant-menu-heading"><h3>Mille järele isu on?</h3></div>
    {loading ? <div className="loading-state" role="status"><Cutlery className="loading-icon" />Seame lauda…</div> : error ? <p role="alert" className="error-message">{error}</p> : <div className="food-card-grid">{foods.map(food => <FoodCard food={food} totals={totals} key={food.id} onChoose={onChoose} />)}</div>}
  </Modal>;
}
