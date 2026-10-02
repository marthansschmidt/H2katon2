import { ChevronRight, Heart } from 'lucide-react';
import { FOOD_GROUPS } from '../data/foodGroups';
import { getMoodLabel, getMoodMessage } from '../game/mood';
import type { FoodGroupTotals } from '../types/game';
import { FoodGroupDot } from './FoodGroupDot';
import { RaccoonCharacter } from './RaccoonCharacter';
export function RaccoonStatus({ score, totals, onProgress }: { score: number; totals?: FoodGroupTotals; onProgress?: () => void }) {
  const filled = totals ? FOOD_GROUPS.filter(group => totals[group.id] > 0).length : 0;
  return <section className={`card raccoon-status ${onProgress ? 'status-with-progress' : ''}`}>
    <div className="raccoon-status-main"><span className="status-avatar"><RaccoonCharacter moodScore={score} small /></span><div><span className="eyebrow">ENESETUNNE</span><h3>{getMoodLabel(score)}</h3><div className="mood-hearts" role="meter" aria-label="Pesukaru enesetunne" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}>{[1, 2, 3, 4, 5].map(value => <Heart key={value} size={17} className={value <= Math.round(score / 20) ? 'filled' : ''} />)}</div></div></div>
    {totals && onProgress ? <button className="status-progress" onClick={onProgress} aria-label={`Mummud: ${filled} / 8 gruppi`}><div><span>Toidupüramiidi täituvus</span><div className="status-group-dots">{FOOD_GROUPS.map(group => <FoodGroupDot key={group.id} color={group.color} filled={totals[group.id] > 0} />)}<small>{filled}/8</small></div></div><ChevronRight size={22} /></button> : <p className="status-message">{getMoodMessage(score)}</p>}
  </section>;
}
