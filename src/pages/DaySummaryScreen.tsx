import { ArrowRight, Check, Sparkles, Star } from 'lucide-react';
import { PrimaryButton } from '../components/Button';
import { FoodPyramid } from '../components/FoodPyramid';
import { GameHeader } from '../components/GameHeader';
import { RaccoonCharacter } from '../components/RaccoonCharacter';
import { SummaryCard } from '../components/SummaryCard';
import { Card } from '../components/Card';
import { generateDayFeedback } from '../game/feedback';
import { calculateDayBalance, totalsForDay } from '../game/foodPyramid';
import { getMoodMessage } from '../game/mood';
import { MAX_DAILY_SCORE } from '../game/scoring';
import { MEAL_ORDER, type PlayerState } from '../types/game';
export function DaySummaryScreen({ player, onNext, onPyramid }: { player: PlayerState; onNext: () => void; onPyramid: () => void }) {
  const day = player.days[player.currentDay - 1];
  const totals = totalsForDay(day);
  const balance = calculateDayBalance(totals);
  return <main className="summary-screen"><GameHeader player={player} complete />
    <div className="summary-overview"><div className="summary-title"><span className="eyebrow">PÄEV {player.currentDay} KOKKUVÕTE</span><h1>Üks päev, palju avastusi.</h1><p className="day-score-total"><Star size={18} fill="currentColor" /><span>Päeva skoor</span><strong>{day.score} / {MAX_DAILY_SCORE}</strong></p></div>
    <div className="summary-character"><div className="summary-speech">{getMoodMessage(player.moodScore)}</div><RaccoonCharacter moodScore={player.moodScore} pose={player.moodScore >= 50 ? 'celebrate' : 'tired'} /></div>
    <div className="summary-metrics"><Card><Star size={20} /><strong>{day.score}</strong><span>päeva punkti</span></Card><Card><Sparkles size={20} /><strong>{balance}%</strong><span>tasakaal</span></Card><Card><Check size={20} /><strong>3 / 3</strong><span>toidukorda</span></Card></div></div>
    <div className="summary-menu"><h2 className="small-section-title">Sinu tänane menüü</h2><div className="selected-meals">{MEAL_ORDER.map(meal => <SummaryCard key={meal} meal={meal} food={day[meal]!} restaurant={day.restaurantNames[meal]} />)}</div></div>
    <FoodPyramid totals={totals} onInfo={onPyramid} staticOpen showHints={false} />
    <Card className="feedback-card"><h2>Mida täna avastasime?</h2>{generateDayFeedback(totals).map(text => <p key={text}>{text}</p>)}</Card>
    <div className="bottom-action"><PrimaryButton onClick={onNext}>{player.currentDay < 3 ? 'Järgmine päev' : 'Vaata lõpptulemust'}<ArrowRight size={20} /></PrimaryButton></div>
  </main>;
}
