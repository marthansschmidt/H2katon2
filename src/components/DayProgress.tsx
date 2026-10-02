import { Check, Moon, Sun, Sunrise } from 'lucide-react';
import { MEAL_LABELS, MEAL_ORDER, type MealTime } from '../types/game';
export function DayProgress({ meal, complete = false }: { meal: MealTime; complete?: boolean }) {
  const icons = [Sunrise, Sun, Moon];
  return <div className="day-progress" aria-label="Päeva toidukorrad">{MEAL_ORDER.map((time, index) => {
    const done = complete || index < MEAL_ORDER.indexOf(meal);
    const active = !complete && time === meal;
    const Icon = done ? Check : icons[index];
    return <div className={`meal-step ${done ? 'done' : ''} ${active ? 'active' : ''}`} key={time} aria-current={active ? 'step' : undefined}><span><Icon size={17} /></span><strong>{MEAL_LABELS[time]}</strong>{index < 2 && <i />}</div>;
  })}</div>;
}
