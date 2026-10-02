import { ArrowRight, Check, Sparkles, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { FoodIllustration } from '../components/FoodIllustration';
import { FoodPyramid } from '../components/FoodPyramid';
import { GameHeader } from '../components/GameHeader';
import { RaccoonStatus } from '../components/RaccoonStatus';
import { generateDayFeedback } from '../game/feedback';
import { calculateDayBalance, totalsForDay } from '../game/foodPyramid';
import { MEAL_LABELS, MEAL_ORDER, type PlayerState } from '../types/game';
export function DaySummaryScreen({ player, onNext, onPyramid }: { player: PlayerState; onNext: () => void; onPyramid: () => void }) {
  const day = player.days[player.currentDay - 1];
  const totals = totalsForDay(day);
  const balance = calculateDayBalance(totals);
  return <main className="summary-screen"><GameHeader player={player} complete /><div className="summary-title"><span className="summary-badge"><Sparkles size={19} />PÄEVA MAITSESEIKLUS TEHTUD</span><h1>Üks päev, palju avastusi.</h1><p>Vaatame, mida sinu {player.currentDay}. päev Tartus kokku tõi.</p></div><div className="game-layout"><div className="summary-main"><div className="summary-metrics"><div><Star size={22} /><strong>{day.score}</strong><span>päeva punkti</span></div><div><Sparkles size={22} /><strong>{balance}%</strong><span>mängu tasakaal</span></div><div><Check size={22} /><strong>3 / 3</strong><span>toidukorda avastatud</span></div></div><h2 className="small-section-title">Sinu tänane menüü</h2><div className="selected-meals">{MEAL_ORDER.map(meal => <article key={meal}><FoodIllustration type={day[meal]!.image} /><div><span className="eyebrow">{MEAL_LABELS[meal]}</span><h3>{day[meal]!.name}</h3><p>{day.restaurantNames[meal]}</p></div><Check size={18} /></article>)}</div><p className="water-summary">Klaasi vett võtsid {day.waterMeals.length} toidukorral.</p><div className="feedback-card"><span className="eyebrow">VÄIKE MÕTE HOMSEKS</span><h2>Mida täna avastasime?</h2>{generateDayFeedback(totals).map(text => <p key={text}><span>✦</span>{text}</p>)}</div><Button onClick={onNext} className="next-day-button">{player.currentDay < 3 ? 'Järgmine päev' : 'Vaata lõpptulemust'}<ArrowRight size={20} /></Button></div><aside className="game-sidebar"><RaccoonStatus score={player.moodScore} /><FoodPyramid totals={totals} onInfo={onPyramid} staticOpen /></aside></div></main>;
}
