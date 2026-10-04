import { ArrowRight } from 'lucide-react';
import { PrimaryButton } from '../components/Button';
import { MobileHeader } from '../components/MobileHeader';
import { RaccoonCharacter } from '../components/RaccoonCharacter';
import { FoodIllustration } from '../components/FoodIllustration';
import { PyramidGraphic } from '../components/FoodPyramid';
import { DAILY_GOAL_EXPLANATION } from '../data/foodGroups';
const steps = [
  { title: 'Avasta Tartut', text: 'Vali Tartu kaardilt söögikoht.' },
  { title: 'Vali oma maitse', text: 'Igal toidukorral on kolm valikut. Otsi toitu, mis lisab kõige rohkem puuduvaid mummusid.' },
  { title: 'Kogu värvilisi mummusid', text: DAILY_GOAL_EXPLANATION },
  { title: 'Leia mõnus tasakaal', text: 'Täidetud grupp enam uusi eesmärgi mummusid ei anna. Vali päeva jooksul erinevaid toite.' },
];
export function TutorialSteps() {
  return <div className="tutorial-steps">{steps.map(({ title, text }, index) => <div className={`card tutorial-step step-${index + 1}`} key={title}><span className="tutorial-step-number">{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><div className="tutorial-step-art" aria-hidden="true">{index === 0 ? <img src="/art/tartu-map-morning.webp" alt="" /> : index === 1 ? <div className="tutorial-foods"><FoodIllustration type="porridge" /><FoodIllustration type="salad" /><FoodIllustration type="pancakes" /></div> : index === 2 ? <PyramidGraphic /> : <RaccoonCharacter pose="celebrate" />}</div></div>)}</div>;
}
export function TutorialScreen({ onBegin, onBack }: { onBegin: () => void; onBack: () => void }) {
  return <main className="tutorial-screen"><MobileHeader title="Kuidas mängida?" onBack={onBack} onClose={onBack} />
    <div className="tutorial-intro"><RaccoonCharacter moodScore={95} /><div><span className="eyebrow">VALMIS SEIKLUSEKS?</span><p>Kolm päeva. Üheksa toidukorda.<br />Valikud on sinu käppades!</p></div></div>
    <TutorialSteps />
    <div className="bottom-action"><PrimaryButton onClick={onBegin}>Alustan!<ArrowRight size={20} /></PrimaryButton></div>
  </main>;
}
