import { Heart } from 'lucide-react';
import { getMoodLabel, getMoodMessage } from '../game/mood';
import { RaccoonCharacter } from './RaccoonCharacter';
export function RaccoonStatus({ score }: { score: number }) {
  return <section className="raccoon-status"><RaccoonCharacter moodScore={score} /><div><span className="eyebrow">SINU SEIKLUSKAASLANE</span><h3><Heart size={16} />{getMoodLabel(score)}</h3><p>{getMoodMessage(score)}</p><div className="mood-track" role="meter" aria-label="Pesukaru enesetunne" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}><span style={{ width: `${score}%` }} /></div></div></section>;
}
