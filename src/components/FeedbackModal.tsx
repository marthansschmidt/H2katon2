import { ArrowRight, GroupIcon } from './Icons';
import { FOOD_GROUPS } from '../data/foodGroups';
import type { Food, FoodGroupTotals, MealTime } from '../types/game';
import { calculateChoiceScore } from '../game/scoring';
import { getFoodContributions, isSweetFood } from '../game/foodPyramid';
import { DAILY_TREAT_LIMIT, type MoodId } from '../game/mood';
import { PrimaryButton } from './Button';
import { Modal } from './Modal';
import { GameCharacter } from './GameCharacter';

export function FeedbackModal({ food, previousTotals, moodScore, moodId, meal, onContinue }: {
  food: Food; previousTotals: FoodGroupTotals; moodScore: number; moodId: MoodId; meal: MealTime; onContinue: () => void;
}) {
  const contributions = getFoodContributions(food, previousTotals);
  const excessTreats = isSweetFood(food) && previousTotals.treats >= DAILY_TREAT_LIMIT;
  const title = excessTreats ? 'Suhkrupauk!' : contributions.length > 1 ? 'Hea valik!' : 'Toit valitud!';
  return <Modal title={title} onClose={onContinue} className="feedback-modal">
    <div className="choice-feedback">
      <div className="feedback-character"><GameCharacter moodScore={moodScore} moodId={moodId} pose="eat" /></div>
      <h3>{food.name}</h3><p className="choice-points">+{calculateChoiceScore(food, previousTotals, meal)} punkti</p>
      <div className="added-groups">{contributions.map(value => {
        const group = FOOD_GROUPS.find(g => g.id === value.groupId)!;
        return <div key={value.groupId}><span className="added-group-icon" style={{ color: group.color }}><GroupIcon name={group.icon} size={24} /></span><strong>+{value.points}</strong><span>{group.shortName.toLowerCase()}</span></div>;
      })}</div>
      <PrimaryButton onClick={onContinue} aria-label={meal === 'dinner' ? 'Vaata päeva kokkuvõtet' : meal === 'breakfast' ? 'Edasi lõunasöögile' : 'Edasi õhtusöögile'}>Jätka<ArrowRight size={18} /></PrimaryButton>
    </div>
  </Modal>;
}
