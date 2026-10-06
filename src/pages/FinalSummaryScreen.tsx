import { Triangle, HeartSolid, HomeSimple, LightBulb, Restart, GroupIcon } from '../components/Icons';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { Card } from '../components/Card';
import { ScoreRating } from '../components/ScoreRating';
import { RaccoonCharacter } from '../components/RaccoonCharacter';
import { FOOD_GROUPS } from '../data/foodGroups';
import { emptyTotals, totalsForDay } from '../game/foodPyramid';
import { getMoodLabel } from '../game/mood';
import type { PlayerState } from '../types/game';

export function FinalSummaryScreen({ player, onRestart, onHome, onPyramid }: {
  player: PlayerState; onRestart: () => void; onHome: () => void; onPyramid: () => void;
}) {
  const totals = player.days.reduce((sum, day) => {
    const daily = totalsForDay(day);
    for (const group of FOOD_GROUPS) sum[group.id] += daily[group.id];
    return sum;
  }, emptyTotals());
  const required = FOOD_GROUPS.filter(group => group.minTarget > 0);
  const most = [...FOOD_GROUPS].sort((a, b) => totals[b.id] - totals[a.id])[0];
  const least = [...required].sort((a, b) => totals[a.id] / a.maxTarget - totals[b.id] / b.maxTarget)[0];
  const insight = totals[least.id] < least.minTarget * 3
    ? `Järgmine kord proovi rohkem sellest grupist: ${least.shortName.toLowerCase()}.`
    : 'Kõik igapäevased grupid leidsid sinu menüüs oma koha!';

  return <main className="final-screen">
    <div className="final-city"><img src="/art/tartu-evening.webp" alt="Õhtune Tartu ja Emajõgi" /></div>
    <div className="final-card"><div className="final-hero">
      <h1 className="final-speech-bubble">Kolm päeva Tartus<br /><span>on läbi!</span></h1>
      <div className="final-raccoon-wrap"><RaccoonCharacter moodScore={player.moodScore} pose="celebrate" /></div>
    </div>
    <Card className="final-results">
      <ScoreRating score={player.score} />
      <div className="result-row result-mood"><HeartSolid size={28} /><div><span>Pesukaru enesetunne</span><strong>{getMoodLabel(player.moodScore)}</strong></div></div>
      <div className="result-row result-food"><GroupIcon name={most.icon} size={29} /><div><span>Kõige rohkem said</span><strong>{most.name}</strong></div></div>
      <div className="result-row result-insight"><LightBulb size={29} /><div><span>Mõte järgmiseks seikluseks</span><p>{insight}</p></div></div>
      <PrimaryButton onClick={onRestart}><Restart size={22} />Mängi uuesti</PrimaryButton>
      <div className="final-secondary-actions"><SecondaryButton onClick={onPyramid}><Triangle size={19} />Toidupüramiid</SecondaryButton><SecondaryButton onClick={onHome}><HomeSimple size={19} />Tagasi menüüsse</SecondaryButton></div>
    </Card>
  </div></main>;
}
