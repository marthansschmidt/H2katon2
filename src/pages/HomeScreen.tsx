import { Lock, OpenBook, PlaySolid, Triangle } from '../components/Icons';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { Card } from '../components/Card';
import { GameCharacter } from '../components/GameCharacter';
import type { CharacterId } from '../types/game';
import { MAX_GAME_SCORE } from '../game/scoring';
import { InfoTooltip, useInfoTooltip } from '../components/InfoTooltip';

export function HomeScreen({ onStart, onTutorial, onPyramid, hasStarted, character, dinosaurUnlocked, onCharacterChange }: { onStart: () => void; onTutorial: () => void; onPyramid: () => void; hasStarted: boolean; character: CharacterId; dinosaurUnlocked: boolean; onCharacterChange: (character: CharacterId) => void }) {
  const unlockInfo = useInfoTooltip();
  return <main className="home-screen">
    <section className="home-hero">
      <div className="game-logo"><h1 aria-label="Toiduseiklus"><span className="logo-food" aria-hidden="true">TOIDUSEIKLUS</span></h1></div>
      <div className="hero-illustration">
        <Card className="hero-description hero-speech-bubble"><p>Aita mul veeta kolm päeva Tartus ja teha <strong>tasakaalustatud toiduvalikuid!</strong></p></Card>
        <div className="hero-character">
          <GameCharacter className="hero-raccoon" moodScore={94} pose="wave" />
          <div className="character-picker" role="group" aria-label="Vali oma tegelane">
            <button type="button" aria-pressed={character === 'raccoon'} onClick={() => onCharacterChange('raccoon')}>Pesukaru</button>
            <span className={`character-choice tooltip-trigger${!dinosaurUnlocked && unlockInfo.visible ? ' is-tooltip-visible' : ''}`} {...unlockInfo.triggerProps}>
              <button type="button" aria-pressed={character === 'dinosaur'} data-locked={!dinosaurUnlocked} aria-expanded={!dinosaurUnlocked ? unlockInfo.visible : undefined} aria-describedby={!dinosaurUnlocked ? 'dinosaur-unlock-hint' : undefined} onClick={() => {
                if (!dinosaurUnlocked) { unlockInfo.toggle(); return; }
                unlockInfo.hide(); onCharacterChange('dinosaur');
              }}>{!dinosaurUnlocked && <Lock size={16} />}Dinosaurus</button>
              {!dinosaurUnlocked && <InfoTooltip id="dinosaur-unlock-hint" className="character-unlock-hint">Ava dinosaurus: kogu mängus {MAX_GAME_SCORE} punkti.</InfoTooltip>}
            </span>
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
