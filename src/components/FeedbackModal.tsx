import { ArrowRight, GroupIcon } from './Icons';
import { FOOD_GROUPS } from '../data/foodGroups';
import type { Food, FoodGroupTotals, MealTime } from '../types/game';
import { calculateChoiceScore } from '../game/scoring';
import { getFoodContributions } from '../game/foodPyramid';
import { PrimaryButton } from './Button';
import { Modal } from './Modal';
import { RaccoonCharacter } from './RaccoonCharacter';

export function FeedbackModal({ food, previousTotals, moodScore, meal, onContinue }: {
  food: Food; previousTotals: FoodGroupTotals; moodScore: number; meal: MealTime; onContinue: () => void;
}) {
  return <Modal title="Hea valik!" onClose={onContinue} className="feedback-modal">
    <div className="choice-feedback">
      <div className="feedback-character"><RaccoonCharacter moodScore={moodScore} pose={moodScore >= 55 ? 'eat' : undefined} /></div>
      <h3>{food.name}</h3><p className="choice-points">+{calculateChoiceScore(food, previousTotals, meal)} punkti</p><p>{getFoodContributions(food, previousTotals).length ? 'Sa said täna juurde:' : 'Selle toidu grupid on tänaseks juba täidetud. Järgmisel korral otsi puuduvaid mummusid.'}</p>
      <div className="added-groups">{getFoodContributions(food, previousTotals).map(value => {
        const group = FOOD_GROUPS.find(g => g.id === value.groupId)!;
        return <div key={value.groupId}><span className="added-group-icon" style={{ color: group.color }}><GroupIcon name={group.icon} size={24} /></span><strong>+{value.points}</strong><span>{group.shortName.toLowerCase()}</span></div>;
      })}</div>
      <PrimaryButton onClick={onContinue} aria-label={meal === 'dinner' ? 'Vaata päeva kokkuvõtet' : meal === 'breakfast' ? 'Edasi lõunasöögile' : 'Edasi õhtusöögile'}>Jätka<ArrowRight size={18} /></PrimaryButton>
    </div>
  </Modal>;
}
