import { Check, Star } from 'lucide-react';
import { DayProgress } from './DayProgress';
import { MealBadge } from './MealBadge';
import type { PlayerState } from '../types/game';
export function GameHeader({ player, complete = false }: { player: PlayerState; complete?: boolean }) {
  return <div className="game-header"><div className="day-heading">
    <div className="day-overview"><span className="day-pill">PÄEV {player.currentDay} / 3</span><DayProgress day={player.currentDay} /></div>
    {complete ? <span className="meal-badge"><Check size={18} />Päev tehtud!</span> : <MealBadge meal={player.currentMeal} />}
    <div className="score-chip"><Star size={17} fill="currentColor" /><strong>{player.score}</strong><span className="sr-only">punkti</span></div>
  </div></div>;
}
