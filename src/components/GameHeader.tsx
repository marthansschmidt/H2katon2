import { Check, StarSolid } from './Icons';
import { DayProgress } from './DayProgress';
import { MealBadge } from './MealBadge';
import type { PlayerState } from '../types/game';
export function GameHeader({ player, complete = false }: { player: PlayerState; complete?: boolean }) {
  return <div className="game-header"><div className="day-heading">
    <div className="day-overview"><span className="day-pill">PÄEV {player.currentDay}</span><DayProgress day={player.currentDay} /></div>
    {complete ? <span className="meal-badge"><Check size={18} />Päev tehtud!</span> : <MealBadge meal={player.currentMeal} />}
    <div className="score-chip"><StarSolid size={17} /><strong>{player.score}</strong><span className="sr-only">punkti</span></div>
  </div></div>;
}
