import { ArrowRight, MapPin, MousePointer2, Shapes, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { RaccoonCharacter } from '../components/RaccoonCharacter';
const steps = [
  { Icon: MapPin, title: 'Linn ootab sind', text: 'Vali Tartu kaardilt söögikoht.' },
  { Icon: MousePointer2, title: 'Mille järele isu on?', text: 'Igas söögikohas saad valida erinevate toitude vahel.' },
  { Icon: Shapes, title: 'Iga amps loeb', text: 'Iga valik täidab sinu päeva toidupüramiidi.' },
  { Icon: Sparkles, title: 'Vaheldus teeb rõõmu', text: 'Püüa päeva jooksul süüa mitmekesiselt. Liiga palju või liiga vähe mõnest grupist mõjutab pesukaru enesetunnet.' },
];
export function TutorialSteps() {
  return <div className="tutorial-steps">{steps.map(({ Icon, title, text }, index) => <div className="tutorial-step" key={title}><span className="tutorial-step-icon"><Icon size={23} /><small>{index + 1}</small></span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div>;
}
export function TutorialScreen({ onBegin }: { onBegin: () => void }) {
  return <main className="tutorial-screen"><section className="tutorial-card"><div className="tutorial-art"><span className="eyebrow">TUTVU OMA SEIKLUSKAASLASEGA</span><h1>Tere, ma olen<br /><span>pesukarulik!</span></h1><RaccoonCharacter moodScore={95} /><div className="tutorial-bubble">Kolm päeva. Üheksa toidukorda.<br /><strong>Lähme koos maitseid avastama!</strong></div></div><div className="tutorial-content"><span className="eyebrow">VÄIKE SPIKKER ENNE SEIKLUST</span><h2>Neli lihtsat sammu.</h2><TutorialSteps /><p className="tutorial-note">Toite ei jagata headeks ja halbadeks. Tähtis on kogu päeva tasakaal. Janu korral võta kaardivaates klaas vett.</p><Button onClick={onBegin}>Alustan!<ArrowRight size={20} /></Button></div></section></main>;
}
