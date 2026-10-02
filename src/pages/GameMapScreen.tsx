import { ArrowRight, RotateCcw } from 'lucide-react';
import { GameHeader } from '../components/GameHeader';
import { TartuMap } from '../components/TartuMap';
import { RaccoonStatus } from '../components/RaccoonStatus';
import { Button } from '../components/Button';
import type { PlayerState, Restaurant } from '../types/game';
export function GameMapScreen({ player, restaurants, onRestaurant, onPyramid, onProgress, loading, error, onRetry }: { player: PlayerState; restaurants: Restaurant[]; onRestaurant: (r: Restaurant) => void; onPyramid: () => void; onProgress: () => void; loading: boolean; error: string | null; onRetry: () => void }) {
  return <main className="game-screen"><GameHeader player={player} /><div className="map-heading sr-only"><h1>Kuhu täna sööma läheme?</h1><p>Puuduta söögikohta ja leia oma lemmik.</p></div>
    {error ? <div className="map-error" role="alert"><p>{error}</p><Button onClick={onRetry}><RotateCcw size={16} />Proovi uuesti</Button></div> : loading ? <div className="map-loading" role="status">Otsime tänaseid maitseid…</div> : <TartuMap restaurants={restaurants} onSelect={onRestaurant} />}
    <details className="restaurant-list"><summary>Kõik tänased söögikohad <span>{restaurants.length}</span></summary><div>{restaurants.map((restaurant, index) => <button key={restaurant.id} onClick={() => onRestaurant(restaurant)}><span className="list-number">{index + 1}</span><div><strong>{restaurant.name}</strong><span>{restaurant.locationLabel}</span></div><ArrowRight size={19} /></button>)}</div></details>
    <button className="text-link pyramid-map-link" onClick={onPyramid}>Tutvu toidupüramiidiga<ArrowRight size={16} /></button>
    <div className="map-status-dock"><RaccoonStatus score={player.moodScore} totals={player.foodGroupTotals} onProgress={onProgress} /></div>
  </main>;
}
