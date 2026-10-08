import { createContext, useContext, useId, type ComponentProps } from 'react';
import type { CharacterId } from '../types/game';
import { getMood, type MoodId } from '../game/mood';
import { RaccoonCharacter, RACCOON_FRAMES } from './RaccoonCharacter';

export const CharacterContext = createContext<CharacterId>('raccoon');
type CharacterProps = ComponentProps<typeof RaccoonCharacter> & { moodId?: MoodId };
const unwellImages: Record<CharacterId, { src: string; portrait: [number, number, number, number] }> = {
  raccoon: { src: '/art/moods/raccoon-low-energy.png', portrait: [125, 65, 350, 270] },
  dinosaur: { src: '/art/moods/dinosaur-unwell.png', portrait: [155, 45, 340, 280] },
};

// Each transparent atlas frame contains one complete pose of the same dinosaur.
const frames = { wave: 0, eat: 724, celebrate: 1448, tired: 0 };

export function GameCharacter({ moodScore = 75, className = '', small = false, pose = 'wave', moodId }: CharacterProps) {
  const character = useContext(CharacterContext);
  const clipId = useId();
  if (moodId === 'unwell') {
    const art = unwellImages[character];
    return <svg className={`raccoon ${character === 'dinosaur' ? 'dinosaur' : ''} ${className} ${small ? 'raccoon-small' : ''} raccoon-unwell`} data-character={character} data-mood="unwell" data-mood-art="true" role="img" aria-label={`Halva enesetundega ${character === 'dinosaur' ? 'dinosaurus' : 'pesukaru'}`} viewBox={small ? art.portrait.join(' ') : '0 0 512 512'} style={small ? { overflow: 'hidden' } : undefined}>
      <image href={art.src} width="512" height="512" />
    </svg>;
  }
  if (character === 'raccoon') return <RaccoonCharacter moodScore={moodScore} className={className} small={small} pose={pose} />;

  const offset = frames[pose];
  // Small portraits start beyond the tail; full poses keep the entire atlas cell.
  const frame = small ? [offset + 200, 0, 524, 395] : [offset, 0, 724, 724];
  const [x, y, width, height] = frame;
  const [, , raccoonWidth, raccoonHeight] = RACCOON_FRAMES[pose];
  const displayWidth = small ? 410 : raccoonWidth;
  const displayHeight = small ? 315 : raccoonHeight;
  // Match the raccoon's display dimensions while preserving the dinosaur's shape.
  return <svg className={`raccoon dinosaur ${className} ${small ? 'raccoon-small' : ''} raccoon-${pose}`} data-character="dinosaur" data-mood={getMood(moodScore).id} role="img" aria-label="Hea enesetundega dinosaurus kollase seljakotiga" viewBox={`0 0 ${displayWidth} ${displayHeight}`}>
    <svg width={displayWidth} height={displayHeight} viewBox={frame.join(' ')} preserveAspectRatio="xMidYMid meet">
      <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
      <image href="/art/dinosaur-pixel-atlas.png" width="2172" height="724" clipPath={`url(#${clipId})`} />
    </svg>
  </svg>;
}
