import { ChevronDown, Star } from 'lucide-react';
import { DayProgress } from './DayProgress';
import type { PlayerState } from '../types/game';
import { FOOD_GROUPS } from '../data/foodGroups';
import { getMoodLabel } from '../game/mood';
import { RaccoonCharacter } from './RaccoonCharacter';
export function GameHeader({ player, complete = false, onProgress }: { player: PlayerState; complete?: boolean; onProgress?: () => void }) {
  const groups = FOOD_GROUPS.filter(group => player.foodGroupTotals[group.id] > 0).length;
  return <div className="game-header"><div className="day-label"><span className="day-pill">PÄEV {player.currentDay} / 3</span><span>Kolm päeva. Sinu valikud.</span></div><DayProgress meal={player.currentMeal} complete={complete} /><div className="score-chip"><Star size={18} /><strong>{player.score}</strong><span>punkti</span></div>{onProgress && <div className="mobile-game-status"><span><RaccoonCharacter moodScore={player.moodScore} small />{getMoodLabel(player.moodScore)}</span><button onClick={onProgress}>Mummud: {groups} / 8 gruppi<ChevronDown size={15} /></button></div>}</div>;
}
