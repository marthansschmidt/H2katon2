import { ArrowRight, StarSolid } from '../components/Icons';
import { PrimaryButton } from '../components/Button';
import { FoodPyramid } from '../components/FoodPyramid';
import { RaccoonCharacter } from '../components/RaccoonCharacter';
import { SummaryCard } from '../components/SummaryCard';
import { totalsForDay } from '../game/foodPyramid';
import { getMoodMessage } from '../game/mood';
import { MAX_DAILY_SCORE } from '../game/scoring';
import { MEAL_ORDER, type PlayerState } from '../types/game';
export function DaySummaryScreen({ player, onNext, onPyramid }: { player: PlayerState; onNext: () => void; onPyramid: () => void }) {
  const day = player.days[player.currentDay - 1];
  const totals = totalsForDay(day);
  return <main className="summary-screen">
    <div className="summary-overview"><div className="summary-title"><h1 className="eyebrow">PÄEV {player.currentDay} KOKKUVÕTE</h1><p className="day-score-total"><StarSolid size={18} /><span>Päeva skoor</span><strong>{day.score} / {MAX_DAILY_SCORE}</strong></p></div>
    <div className="summary-character"><div className="summary-speech">{getMoodMessage(player.moodScore)}</div><RaccoonCharacter moodScore={player.moodScore} /></div>
    </div>
    <FoodPyramid totals={totals} onInfo={onPyramid} staticOpen showHints={false} layout="steps" />
    <div className="summary-menu"><h2 className="small-section-title">Sinu tänane menüü</h2><div className="selected-meals">{MEAL_ORDER.map(meal => <SummaryCard key={meal} meal={meal} food={day[meal]!} restaurant={day.restaurantNames[meal]} />)}</div></div>
    <div className="bottom-action"><PrimaryButton onClick={onNext}>{player.currentDay < 3 ? 'Järgmine päev' : 'Vaata lõpptulemust'}<ArrowRight size={20} /></PrimaryButton></div>
  </main>;
}
