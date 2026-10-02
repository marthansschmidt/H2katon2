import { MapPin, Utensils } from 'lucide-react';
import type { Food, MealTime, Restaurant } from '../types/game';
import { MEAL_LABELS } from '../types/game';
import { Modal } from './Modal';
import { FoodCard } from './FoodCard';
import { GroupIcon } from './Icons';
export function RestaurantModal({ restaurant, foods, meal, onClose, onChoose, loading, error }: { restaurant: Restaurant; foods: Food[]; meal: MealTime; onClose: () => void; onChoose: (food: Food) => void; loading: boolean; error: string | null }) {
  return <Modal title={restaurant.name} onClose={onClose} wide><div className="restaurant-subheading"><span><MapPin size={15} />{restaurant.locationLabel}</span><span><GroupIcon name={restaurant.icon} size={16} />{MEAL_LABELS[meal]}</span></div><p className="restaurant-intro">Mille järele täna isu on? Iga valik täiendab sinu päeva.</p>{loading ? <div className="loading-state" role="status"><Utensils className="loading-icon" />Seame lauda…</div> : error ? <p role="alert" className="error-message">{error}</p> : <div className="food-card-grid">{foods.map(food => <FoodCard food={food} key={food.id} onChoose={onChoose} />)}</div>}<p className="menu-note">Fiktiivne söögikoht ja näidismenüü · Vaata päeva tervikut, mitte ühte ampsu.</p></Modal>;
}
