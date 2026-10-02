import { Award, BookOpen, Heart, Home, Lightbulb, RotateCcw, Sparkles } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { Card } from '../components/Card';
import { RaccoonCharacter } from '../components/RaccoonCharacter';
import { GroupIcon } from '../components/Icons';
import { FOOD_GROUPS } from '../data/foodGroups';
import { calculateDayBalance, calculateFoodGroupTotals, foodsForDay, totalsForDay } from '../game/foodPyramid';
import { getMoodLabel } from '../game/mood';
import type { PlayerState } from '../types/game';

export function FinalSummaryScreen({ player, onRestart, onHome, onPyramid }: {
  player: PlayerState; onRestart: () => void; onHome: () => void; onPyramid: () => void;
}) {
  const foods = player.days.flatMap(foodsForDay);
  const totals = calculateFoodGroupTotals(foods, player.days.reduce((sum, day) => sum + day.waterMeals.length, 0));
  const balance = Math.round(player.days.reduce((sum, day) => sum + calculateDayBalance(totalsForDay(day)), 0) / 3);
  const required = FOOD_GROUPS.filter(group => group.minTarget > 0);
  const most = [...FOOD_GROUPS].sort((a, b) => totals[b.id] - totals[a.id])[0];
  const least = [...required].sort((a, b) => totals[a.id] - totals[b.id])[0];
  const diversity = Math.round(required.filter(g => totals[g.id] > 0).length / required.length * 100);
  const insight = totals[least.id] < least.minTarget * 3
    ? `Järgmine kord proovi rohkem sellest grupist: ${least.shortName.toLowerCase()}.`
    : 'Kõik igapäevased grupid leidsid sinu menüüs oma koha!';

  return <main className="final-screen"><div className="final-card">
    <div className="final-hero"><div className="final-city"><img src="/art/tartu-evening.webp" alt="Õhtune Tartu ja Emajõgi" /></div>
      <h1>Kolm päeva Tartus<br /><span>on läbi!</span></h1>
      <p className="final-intro">Üheksa valikut, palju uusi maitseid.</p>
      <div className="final-raccoon-wrap"><RaccoonCharacter moodScore={player.moodScore} pose={player.moodScore >= 50 ? 'celebrate' : 'tired'} /><span className="confetti c1">✦</span><span className="confetti c2">✧</span></div>
    </div>
    <Card className="final-results">
      <div className="result-row result-score"><Award size={32} /><div><span>Koguskoor</span><strong>{player.score}</strong></div></div>
      <div className="result-row result-mood"><Heart size={28} fill="currentColor" /><div><span>Pesukaru enesetunne</span><strong>{getMoodLabel(player.moodScore)}</strong></div></div>
      <div className="result-row result-food"><GroupIcon name={most.icon} size={29} /><div><span>Kõige rohkem said</span><strong>{most.name}</strong><small>{totals[most.id]} mummu</small></div></div>
      <div className="result-row result-insight"><Lightbulb size={29} /><div><span>Mõte järgmiseks seikluseks</span><p>{insight}</p></div></div>
      <div className="final-extra-metrics"><span><Sparkles size={15} /><strong>{balance}%</strong> tasakaal</span><span><strong>{diversity}%</strong> mitmekesisus</span></div>
      <p className="final-footnote">Mummud ja protsendid on mängu tagasiside. Maiustusi ei pea sööma.</p>
      <PrimaryButton onClick={onRestart}><RotateCcw size={22} />Mängi uuesti</PrimaryButton>
      <div className="final-secondary-actions"><SecondaryButton onClick={onPyramid}><BookOpen size={19} />Toidupüramiid</SecondaryButton><SecondaryButton onClick={onHome}><Home size={19} />Tagasi menüüsse</SecondaryButton></div>
    </Card>
  </div></main>;
}
