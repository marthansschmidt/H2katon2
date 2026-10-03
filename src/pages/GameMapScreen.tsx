import { RotateCcw } from 'lucide-react';
import { GameHeader } from '../components/GameHeader';
import { TartuMap } from '../components/TartuMap';
import { RaccoonStatus } from '../components/RaccoonStatus';
import { Button } from '../components/Button';
import type { PlayerState, Restaurant } from '../types/game';
export function GameMapScreen({ player, restaurants, onRestaurant, onProgress, loading, error, onRetry }: { player: PlayerState; restaurants: Restaurant[]; onRestaurant: (r: Restaurant) => void; onProgress: () => void; loading: boolean; error: string | null; onRetry: () => void }) {
  const day = player.days[player.currentDay - 1];
  const chosenName = day[player.currentMeal] ? day.restaurantNames[player.currentMeal] : undefined;
  const hiddenRestaurantId = restaurants.find(restaurant => restaurant.name === chosenName)?.id;
  return <main className="game-screen"><GameHeader player={player} /><div className="map-heading sr-only"><h1>Kuhu täna sööma läheme?</h1><p>Puuduta söögikohta ja leia oma lemmik.</p></div>
    {error ? <div className="map-error" role="alert"><p>{error}</p><Button onClick={onRetry}><RotateCcw size={16} />Proovi uuesti</Button></div> : loading && !restaurants.length ? <div className="map-loading" role="status">Otsime tänaseid maitseid…</div> : <TartuMap restaurants={restaurants} meal={player.currentMeal} hiddenRestaurantId={hiddenRestaurantId} disabled={loading} onSelect={onRestaurant} />}
    <div className="map-status-dock"><RaccoonStatus score={player.moodScore} totals={player.foodGroupTotals} onProgress={onProgress} /></div>
  </main>;
}
