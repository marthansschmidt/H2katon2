import { ArrowRight } from 'lucide-react';
import { FOOD_GROUPS } from '../data/foodGroups';
import type { Food, MealTime } from '../types/game';
import { PrimaryButton } from './Button';
import { GroupIcon } from './Icons';
import { Modal } from './Modal';
import { RaccoonCharacter } from './RaccoonCharacter';

export function FeedbackModal({ food, moodScore, meal, onContinue }: {
  food: Food; moodScore: number; meal: MealTime; onContinue: () => void;
}) {
  return <Modal title="Hea valik!" onClose={onContinue} className="feedback-modal">
    <div className="choice-feedback">
      <div className="feedback-character"><RaccoonCharacter moodScore={moodScore} pose="eat" /></div>
      <h3>{food.name}</h3><p>Sa said täna juurde:</p>
      <div className="added-groups">{food.groups.map(value => {
        const group = FOOD_GROUPS.find(g => g.id === value.groupId)!;
        return <div key={value.groupId}><span className="added-group-icon" style={{ color: group.color }}><GroupIcon name={group.icon} size={24} /></span><strong>+{value.points}</strong><span>{group.shortName.toLowerCase()}</span></div>;
      })}</div>
      <PrimaryButton onClick={onContinue} aria-label={meal === 'dinner' ? 'Vaata päeva kokkuvõtet' : meal === 'breakfast' ? 'Edasi lõunasöögile' : 'Edasi õhtusöögile'}>Jätka<ArrowRight size={18} /></PrimaryButton>
    </div>
  </Modal>;
}
