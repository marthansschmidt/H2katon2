import { MapPin, Utensils } from 'lucide-react';
import type { Food, MealTime, Restaurant } from '../types/game';
import { Modal } from './Modal';
import { FoodCard } from './FoodCard';
import { MealBadge } from './MealBadge';
import { Card } from './Card';
export function RestaurantModal({ restaurant, foods, meal, onClose, onChoose, loading, error }: { restaurant: Restaurant; foods: Food[]; meal: MealTime; onClose: () => void; onChoose: (food: Food) => void; loading: boolean; error: string | null }) {
  return <Modal title={restaurant.name} onClose={onClose} wide>
    <div className="restaurant-hero"><img className="restaurant-art" src="/art/tartu-day.webp" alt="Tartu raekoda ja Emajõe kaldapealne" /><span className="restaurant-location"><MapPin size={16} />{restaurant.locationLabel}</span><span className="restaurant-hero-icon"><Utensils size={30} /></span></div>
    <Card className="restaurant-info"><p>Mängu näidismenüü. Iga valik täiendab sinu päeva.</p><MealBadge meal={meal} /></Card>
    <div className="restaurant-menu-heading"><h3>Mille järele isu on?</h3><span>{foods.length} valikut</span></div>
    {loading ? <div className="loading-state" role="status"><Utensils className="loading-icon" />Seame lauda…</div> : error ? <p role="alert" className="error-message">{error}</p> : <div className="food-card-grid">{foods.map(food => <FoodCard food={food} key={food.id} onChoose={onChoose} />)}</div>}
  </Modal>;
}
