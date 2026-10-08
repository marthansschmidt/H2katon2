import { Cutlery } from './Icons';
import type { Food, FoodGroupTotals, MealTime, Restaurant } from '../types/game';
import { Modal } from './Modal';
import { FoodCard } from './FoodCard';
import { MealBadge } from './MealBadge';
import { RESTAURANT_BANNERS } from '../data/restaurantBanners';
import { RestaurantLogo } from './RestaurantLogo';
import { InfoTooltip, useInfoTooltip } from './InfoTooltip';
export function RestaurantModal({ restaurant, foods, totals, meal, onClose, onChoose, loading, error }: { restaurant: Restaurant; foods: Food[]; totals: FoodGroupTotals; meal: MealTime; onClose: () => void; onChoose: (food: Food) => void; loading: boolean; error: string | null }) {
  const banner = RESTAURANT_BANNERS[restaurant.id];
  const nameInfo = useInfoTooltip();
  return <Modal title={restaurant.name} headerTitle={<h2><MealBadge meal={meal} /></h2>} onClose={onClose} wide className="restaurant-modal">
    <button type="button" className={`restaurant-hero tooltip-trigger${nameInfo.visible ? ' is-tooltip-visible' : ''}`} aria-label={`Söögikoha nimi: ${restaurant.name}`} aria-expanded={nameInfo.visible} aria-describedby={`restaurant-banner-name-${restaurant.id}`} onClick={nameInfo.toggle} {...nameInfo.triggerProps}>
      <img className="restaurant-art" src={banner?.src ?? '/art/tartu-day.webp'} alt={banner?.alt ?? 'Tartu raekoda ja Emajõe kaldapealne'} />
      <span className="restaurant-banner-brand" role="group" aria-label={`${restaurant.name} logo`}>
        <RestaurantLogo restaurant={restaurant} />
        <InfoTooltip id={`restaurant-banner-name-${restaurant.id}`} className="restaurant-name-tooltip">{restaurant.name}</InfoTooltip>
      </span>
    </button>
    <div className="restaurant-menu-heading"><h3>Mille järele isu on?</h3></div>
    {loading ? <div className="loading-state" role="status"><Cutlery className="loading-icon" />Seame lauda…</div> : error ? <p role="alert" className="error-message">{error}</p> : <div className="food-card-grid">{foods.map(food => <FoodCard food={food} totals={totals} key={food.id} onChoose={onChoose} />)}</div>}
  </Modal>;
}
