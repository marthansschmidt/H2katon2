import { OpenBook, PlaySolid, Triangle } from '../components/Icons';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { Card } from '../components/Card';
import { GameCharacter } from '../components/GameCharacter';
import type { CharacterId } from '../types/game';

export function HomeScreen({ onStart, onTutorial, onPyramid, hasStarted, character, onCharacterChange }: { onStart: () => void; onTutorial: () => void; onPyramid: () => void; hasStarted: boolean; character: CharacterId; onCharacterChange: (character: CharacterId) => void }) {
  return <main className="home-screen">
    <section className="home-hero">
      <div className="game-logo"><h1 aria-label="Toiduseiklus"><span className="logo-food" aria-hidden="true">TOIDUSEIKLUS</span></h1></div>
      <div className="hero-illustration">
        <Card className="hero-description hero-speech-bubble"><p>Aita mul veeta kolm päeva Tartus ja teha <strong>tasakaalustatud toiduvalikuid!</strong></p></Card>
        <div className="hero-character">
          <GameCharacter className="hero-raccoon" moodScore={94} pose="wave" />
          <div className="character-picker" role="group" aria-label="Vali oma tegelane">
            <button type="button" aria-pressed={character === 'raccoon'} onClick={() => onCharacterChange('raccoon')}>Pesukaru</button>
            <button type="button" aria-pressed={character === 'dinosaur'} onClick={() => onCharacterChange('dinosaur')}>Dinosaurus</button>
          </div>
        </div>
      </div>
      <div className="home-actions">
        <PrimaryButton onClick={onStart} className="start-button"><PlaySolid size={24} />{hasStarted ? 'Uus mäng' : 'Alusta mängu'}</PrimaryButton>
        <div className="home-secondary-actions"><SecondaryButton onClick={onTutorial}><OpenBook size={25} />Kuidas mängida?</SecondaryButton><SecondaryButton onClick={onPyramid} aria-label="Avasta toidupüramiidi"><Triangle size={25} />Toidupüramiid</SecondaryButton></div>
      </div>
    </section>
  </main>;
}
