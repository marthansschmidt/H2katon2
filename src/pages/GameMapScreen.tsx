import { ArrowRight, Droplets, RotateCcw, Sunrise, Sun, Moon } from 'lucide-react';
import { GameHeader } from '../components/GameHeader';
import { TartuMap } from '../components/TartuMap';
import { FoodPyramid } from '../components/FoodPyramid';
import { RaccoonStatus } from '../components/RaccoonStatus';
import { Button } from '../components/Button';
import { MEAL_LABELS, type PlayerState, type Restaurant } from '../types/game';
export function GameMapScreen({ player, restaurants, onRestaurant, onWater, onPyramid, onProgress, loading, error, onRetry }: { player: PlayerState; restaurants: Restaurant[]; onRestaurant: (r: Restaurant) => void; onWater: () => void; onPyramid: () => void; onProgress: () => void; loading: boolean; error: string | null; onRetry: () => void }) {
  const waterTaken = player.days[player.currentDay - 1].waterMeals.includes(player.currentMeal);
  const MealIcon = { breakfast: Sunrise, lunch: Sun, dinner: Moon }[player.currentMeal];
  return <main className="game-screen"><GameHeader player={player} onProgress={onProgress} /><div className="game-layout"><div className="game-main"><div className="map-heading"><div><span className="eyebrow"><MealIcon size={15} />{MEAL_LABELS[player.currentMeal].toUpperCase()} ON OOTEL</span><h1>Kuhu täna sööma läheme?</h1><p>Vali kaardilt söögikoht ja avasta tänane menüü.</p></div></div>{error ? <div className="map-error" role="alert"><p>{error}</p><Button onClick={onRetry}><RotateCcw size={16} />Proovi uuesti</Button></div> : loading ? <div className="map-loading" role="status">Otsime tänaseid maitseid…</div> : <TartuMap restaurants={restaurants} onSelect={onRestaurant} />}
      <div className="map-below"><span><span className="available-dot" />{restaurants.length} söögikohta avastamiseks</span><button className={`water-button ${waterTaken ? 'water-taken' : ''}`} onClick={onWater} disabled={waterTaken}><Droplets size={18} />{waterTaken ? 'Vesi joodud ✓' : 'Võtan klaasi vett'}{!waterTaken && <span>+1</span>}</button></div>
      <div className="restaurant-list" aria-label="Söögikohad nimekirjana">{restaurants.map((restaurant, index) => <button key={restaurant.id} onClick={() => onRestaurant(restaurant)}><span className="list-number">{index + 1}</span><div><strong>{restaurant.name}</strong><span>{restaurant.locationLabel}</span></div><ArrowRight size={17} /></button>)}</div>
    </div><aside className="game-sidebar"><RaccoonStatus score={player.moodScore} /><FoodPyramid totals={player.foodGroupTotals} onInfo={onPyramid} /></aside></div></main>;
}
