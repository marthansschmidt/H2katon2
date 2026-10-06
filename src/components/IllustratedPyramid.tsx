import { FOOD_GROUPS } from '../data/foodGroups';
import type { FoodGroupId, FoodGroupTotals } from '../types/game';
import { FoodGroupProgress } from './FoodGroupProgress';
import { GroupIcon } from './Icons';

type Level = {
  top: number;
  bottom: number;
  groups: FoodGroupId[];
  color: string;
};

const HEIGHT = 784;
const WIDTH = 1000;
const GAP = 24;
const leftEdge = (y: number) => WIDTH / 2 * (1 - y / HEIGHT);
const levels: Level[] = [
  { top: 0, bottom: 214, groups: ['treats'], color: '#ff595f' },
  { top: 238, bottom: 404, groups: ['protein'], color: '#ffde00' },
  { top: 428, bottom: 594, groups: ['dairy', 'fats'], color: '#6ca9e8' },
  { top: 618, bottom: 784, groups: ['grains', 'vegetables', 'fruits'], color: '#a4da00' },
];

export function IllustratedPyramid({ totals }: { totals?: FoodGroupTotals }) {
  const hasProgress = totals !== undefined;
  return <div className={`illustrated-pyramid ${hasProgress ? 'group-progress-list pyramid-progress' : 'pyramid-graphic'}`} style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    role={hasProgress ? undefined : 'img'} aria-label={hasProgress ? undefined : 'Toidupüramiid: maiustused tipus, valguallikad nende all, piimatooted ja toidurasvad keskel, teraviljad, köögiviljad ja puuviljad alusel'}>
    {levels.map((level, index) => {
      // Every outer corner lies on the same two lines, including split sections.
      const left = leftEdge(level.bottom);
      const width = WIDTH - 2 * left;
      const segmentWidth = (width - GAP * (level.groups.length - 1)) / level.groups.length;
      return <div className={`pyramid-step pyramid-step-${index + 1}`} key={index} style={{
        left: `${left / WIDTH * 100}%`, top: `${level.top / HEIGHT * 100}%`, width: `${width / WIDTH * 100}%`, height: `${(level.bottom - level.top) / HEIGHT * 100}%`,
        gridTemplateColumns: `repeat(${level.groups.length}, minmax(0, 1fr))`, columnGap: `${GAP / width * 100}%`,
      }}>
        {level.groups.map((id, segmentIndex) => {
          const group = FOOD_GROUPS.find(group => group.id === id)!;
          const start = left + segmentIndex * (segmentWidth + GAP);
          const topLeft = segmentIndex === 0 ? (leftEdge(level.top) - start) / segmentWidth * 100 : 0;
          const topRight = segmentIndex === level.groups.length - 1 ? (WIDTH - leftEdge(level.top) - start) / segmentWidth * 100 : 100;
          return <div className={`pyramid-segment pyramid-segment-${id}`} key={id}>
            <svg className="pyramid-segment-shape" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <polygon points={`${topLeft},0 ${topRight},0 100,100 0,100`} fill={level.color} />
            </svg>
            {hasProgress ? <FoodGroupProgress group={group} value={totals[id]} showOptionalLabel={false} showOptionalGoal={false} showIcon={false} iconDots />
              : <><span className="pyramid-symbol"><GroupIcon name={group.icon} size={24} /></span><span className="pyramid-segment-label">{group.shortName}</span></>}
          </div>;
        })}
      </div>;
    })}
  </div>;
}
