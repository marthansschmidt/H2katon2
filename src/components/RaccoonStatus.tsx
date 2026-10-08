import type { getMoodForDay } from '../game/mood';
import { GameCharacter } from './GameCharacter';
export function RaccoonStatus({ mood }: { mood: ReturnType<typeof getMoodForDay> }) {
  return <section className="card raccoon-status" data-mood={mood.id} aria-live="polite" aria-atomic="true">
    <div className="raccoon-status-main"><span className="status-avatar"><GameCharacter moodScore={mood.score} moodId={mood.id} pose="wave" small /></span><div><span className="eyebrow">ENESETUNNE</span><h3>{mood.id === 'unwell' ? 'Suhkru üledoos' : 'Hea ja värske olla'}</h3></div></div>
  </section>;
}
