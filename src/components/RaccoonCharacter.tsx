import { useId } from 'react';
import { getMood, type MoodId } from '../game/mood';

type RaccoonPose = 'wave' | 'eat' | 'celebrate' | 'tired';
// Temporarily use the original artwork while retaining explicit scene poses.
const USE_MOOD_EXPRESSIONS = false;
const bounds: Record<RaccoonPose, [number, number, number, number]> = {
  wave: [88, 5, 606, 544], eat: [735, 14, 578, 546],
  celebrate: [115, 539, 569, 541], tired: [761, 558, 608, 527],
};
const portraits: Record<RaccoonPose, [number, number, number, number]> = {
  wave: [240, 10, 410, 315], eat: [850, 20, 410, 315],
  celebrate: [225, 550, 410, 315], tired: [845, 560, 410, 315],
};
const moodArt: Partial<Record<MoodId, { src: string; portrait: [number, number, number, number] }>> = {
  concerned: { src: '/art/moods/raccoon-concerned.png', portrait: [125, 50, 315, 250] },
  tired: { src: '/art/moods/raccoon-tired.png', portrait: [125, 70, 315, 240] },
  'low-energy': { src: '/art/moods/raccoon-low-energy.png', portrait: [140, 70, 330, 240] },
};

export function RaccoonCharacter({ moodScore = 75, className = '', small = false, pose }: {
  moodScore?: number; className?: string; small?: boolean; pose?: RaccoonPose;
}) {
  const clipId = useId();
  const mood = getMood(moodScore);
  const generated = USE_MOOD_EXPRESSIONS && !pose ? moodArt[mood.id] : undefined;
  if (generated) {
    const frame = small ? generated.portrait : [0, 0, 512, 512];
    return <svg className={`raccoon ${className} ${small ? 'raccoon-small' : ''} raccoon-${mood.id}`} data-mood={mood.id} role="img" aria-label={`${mood.label} pesukaru`} viewBox={frame.join(' ')}>
      <image href={generated.src} width="512" height="512" />
    </svg>;
  }
  const expression = pose ?? (USE_MOOD_EXPRESSIONS ? mood.id === 'joyful' ? 'celebrate' : mood.id === 'happy' ? 'eat' : 'wave' : 'wave');
  const frame = small ? portraits[expression] : bounds[expression];
  const [x, y, width, height] = frame;
  return <svg className={`raccoon ${className} ${small ? 'raccoon-small' : ''} raccoon-${expression}`} data-mood={mood.id} role="img" aria-label={pose || !USE_MOOD_EXPRESSIONS ? 'Sõbralik pesukaru kollase seljakotiga' : `${mood.label} pesukaru`} viewBox={frame.join(' ')}>
    <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
    <image href="/art/raccoon-atlas.webp" width="1443" height="1090" clipPath={`url(#${clipId})`} />
  </svg>;
}
