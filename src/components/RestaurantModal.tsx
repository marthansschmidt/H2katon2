import { Utensils } from 'lucide-react';
import type { Food, FoodGroupTotals, MealTime, Restaurant } from '../types/game';
import { Modal } from './Modal';
import { FoodCard } from './FoodCard';
import { MealBadge } from './MealBadge';
import { Card } from './Card';
export function RestaurantModal({ restaurant, foods, totals, meal, onClose, onChoose, loading, error }: { restaurant: Restaurant; foods: Food[]; totals: FoodGroupTotals; meal: MealTime; onClose: () => void; onChoose: (food: Food) => void; loading: boolean; error: string | null }) {
  return <Modal title={restaurant.name} onClose={onClose} wide className="restaurant-modal">
    <div className="restaurant-hero"><img className="restaurant-art" src="/art/tartu-day.webp" alt="Tartu raekoda ja Emajõe kaldapealne" /><span className="restaurant-hero-icon"><Utensils size={30} /></span></div>
    <Card className="restaurant-info"><p>Vali kolmest toidust see, mis lisab kõige rohkem puuduvaid eesmärgi mummusid.</p><MealBadge meal={meal} /></Card>
    <div className="restaurant-menu-heading"><h3>Mille järele isu on?</h3><span>{foods.length} valikut</span></div>
    {loading ? <div className="loading-state" role="status"><Utensils className="loading-icon" />Seame lauda…</div> : error ? <p role="alert" className="error-message">{error}</p> : <div className="food-card-grid">{foods.map(food => <FoodCard food={food} totals={totals} key={food.id} onChoose={onChoose} />)}</div>}
  </Modal>;
}
