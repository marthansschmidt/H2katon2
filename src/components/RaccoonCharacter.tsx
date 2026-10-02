import { useId } from 'react';

type RaccoonPose = 'wave' | 'eat' | 'celebrate' | 'tired';
const bounds: Record<RaccoonPose, [number, number, number, number]> = {
  wave: [88, 5, 606, 544], eat: [735, 14, 578, 546],
  celebrate: [115, 539, 569, 541], tired: [761, 558, 608, 527],
};
const portraits: Record<RaccoonPose, [number, number, number, number]> = {
  wave: [240, 10, 410, 315], eat: [850, 20, 410, 315],
  celebrate: [225, 550, 410, 315], tired: [845, 560, 410, 315],
};

export function RaccoonCharacter({ moodScore = 75, className = '', small = false, pose }: {
  moodScore?: number; className?: string; small?: boolean; pose?: RaccoonPose;
}) {
  const clipId = useId();
  const tired = moodScore < 50;
  const expression = pose ?? (tired ? 'tired' : 'wave');
  const frame = small ? portraits[expression] : bounds[expression];
  const [x, y, width, height] = frame;
  return <svg className={`raccoon ${className} ${small ? 'raccoon-small' : ''} raccoon-${expression}`} role="img" aria-label={tired ? 'Veidi väsinud pesukaru' : 'Sõbralik pesukaru kollase seljakotiga'} viewBox={frame.join(' ')}>
    <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
    <image href="/art/raccoon-atlas.webp" width="1443" height="1090" clipPath={`url(#${clipId})`} />
  </svg>;
}
