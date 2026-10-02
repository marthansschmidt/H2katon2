import { ArrowRight, Award, RotateCcw, Shapes, Sparkles, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { RaccoonCharacter } from '../components/RaccoonCharacter';
import { GroupIcon } from '../components/Icons';
import { FOOD_GROUPS } from '../data/foodGroups';
import { calculateDayBalance, calculateFoodGroupTotals, foodsForDay, totalsForDay } from '../game/foodPyramid';
import { getMoodLabel } from '../game/mood';
import type { PlayerState } from '../types/game';
export function FinalSummaryScreen({ player, onRestart, onHome, onPyramid }: { player: PlayerState; onRestart: () => void; onHome: () => void; onPyramid: () => void }) {
  const foods = player.days.flatMap(foodsForDay);
  const totals = calculateFoodGroupTotals(foods, player.days.reduce((sum, day) => sum + day.waterMeals.length, 0));
  const balance = Math.round(player.days.reduce((sum, day) => sum + calculateDayBalance(totalsForDay(day)), 0) / 3);
  const required = FOOD_GROUPS.filter(group => group.minTarget > 0);
  const most = [...FOOD_GROUPS].sort((a, b) => totals[b.id] - totals[a.id])[0];
  const least = [...required].sort((a, b) => totals[a.id] - totals[b.id])[0];
  const diversity = Math.round(required.filter(g => totals[g.id] > 0).length / required.length * 100);
  return <main className="final-screen"><div className="final-card"><span className="summary-badge"><Award size={19} />MAITSEAVASTAJA</span><h1>Kolm päeva Tartus<br /><span>on läbi!</span></h1><p className="final-intro">Üheksa valikut, palju uusi maitseid.<br />Sinu pesukarulik tänab sind seikluse eest!</p><div className="final-raccoon-wrap"><span className="confetti c1">✦</span><span className="confetti c2">+</span><span className="confetti c3">✦</span><RaccoonCharacter moodScore={player.moodScore} /><span className="final-mood">{getMoodLabel(player.moodScore)}</span></div><div className="final-metrics"><div><Star size={22} /><strong>{player.score}</strong><span>koguskoor</span></div><div><Sparkles size={22} /><strong>{balance}%</strong><span>keskmine tasakaal</span></div><div><Shapes size={22} /><strong>{diversity}%</strong><span>gruppide mitmekesisus</span></div></div><div className="final-group-cards"><div><GroupIcon name={most.icon} size={24} /><span>Kõige rohkem mummusid</span><strong>{most.name}</strong><small>{totals[most.id]} mummu</small></div><div><GroupIcon name={least.icon} size={24} /><span>Kõige vähem mummusid*</span><strong>{least.name}</strong><small>{totals[least.id]} mummu</small></div></div><p className="final-thought">{balance >= 75 ? 'Sinu pesukaru sõi kolme päeva jooksul üsna mitmekesiselt.' : 'Proovisid kolme päeva jooksul erinevaid toite. Iga uus mäng on võimalus veel rohkem maitseid avastada.'} {totals[least.id] < least.minTarget * 3 ? `Järgmine kord proovi rohkem sellest grupist: ${least.shortName.toLowerCase()}.` : 'Kõik igapäevased grupid leidsid sinu menüüs oma koha!'}</p><p className="final-footnote">*Igapäevastest gruppidest. Maiustusi ei pea sööma. Protsendid on mängu tagasiside, mitte hinnang sinu tervisele.</p><div className="final-actions"><Button onClick={onRestart}><RotateCcw size={18} />Mängi uuesti</Button><Button onClick={onHome} variant="secondary">Tagasi menüüsse<ArrowRight size={18} /></Button></div><button className="text-link" onClick={onPyramid}>Vaata toidupüramiidi <ArrowRight size={17} /></button></div></main>;
}
