import { getMoodLabel } from '../game/mood';
import { RaccoonCharacter } from './RaccoonCharacter';
export function RaccoonStatus({ score }: { score: number }) {
  return <section className="card raccoon-status">
    <div className="raccoon-status-main"><span className="status-avatar"><RaccoonCharacter moodScore={score} small /></span><div><span className="eyebrow">ENESETUNNE</span><h3>{getMoodLabel(score)}</h3></div></div>
  </section>;
}
