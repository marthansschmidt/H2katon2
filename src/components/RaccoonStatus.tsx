import { getMood, getMoodHint } from '../game/mood';
import type { FoodGroupTotals } from '../types/game';
import { RaccoonCharacter } from './RaccoonCharacter';
export function RaccoonStatus({ score, totals }: { score: number; totals: FoodGroupTotals }) {
  const mood = getMood(score);
  const hint = getMoodHint(score, totals);
  return <section className="card raccoon-status" data-mood={mood.id} aria-live="polite" aria-atomic="true">
    <div className="raccoon-status-main"><span className="status-avatar"><RaccoonCharacter moodScore={score} small /></span><div><span className="eyebrow">ENESETUNNE</span><h3>{mood.label}</h3>{hint && <p className="mood-hint">{hint}</p>}</div></div>
  </section>;
}
