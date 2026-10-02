import { BookOpen, Play, Triangle } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { Card } from '../components/Card';
import { RaccoonCharacter } from '../components/RaccoonCharacter';

export function HomeScreen({ onStart, onTutorial, onPyramid, onResume }: { onStart: () => void; onTutorial: () => void; onPyramid: () => void; onResume?: () => void }) {
  return <main className="home-screen">
    <section className="home-hero">
      <div className="game-logo"><h1 aria-label="Toiduseiklus"><span className="logo-food" aria-hidden="true">TOIDUSEIKLUS</span></h1></div>
      <div className="hero-illustration">
        <Card className="hero-description hero-speech-bubble"><p>Aita mul veeta kolm päeva Tartus ja teha <strong>tasakaalustatud toiduvalikuid!</strong></p></Card>
        <RaccoonCharacter className="hero-raccoon" moodScore={94} />
      </div>
      <div className="home-actions">
        <PrimaryButton onClick={onResume ?? onStart} className="start-button"><Play size={24} fill="currentColor" />{onResume ? 'Jätka seiklust' : 'Alusta mängu'}</PrimaryButton>
        <div className="home-secondary-actions"><SecondaryButton onClick={onTutorial}><BookOpen size={25} />Kuidas mängida?</SecondaryButton><SecondaryButton onClick={onPyramid} aria-label="Avasta toidupüramiidi"><Triangle size={25} />Toidupüramiid</SecondaryButton></div>
        {onResume && <button className="new-game-link" onClick={onStart}>Alusta uut mängu</button>}
      </div>
    </section>
  </main>;
}
