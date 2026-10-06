import { NavArrowDown, NavArrowUp, InfoCircle } from './Icons';
import { useState } from 'react';
import { DAILY_GOAL_EXPLANATION, FOOD_GROUPS, REQUIRED_FOOD_GROUPS } from '../data/foodGroups';
import type { FoodGroupTotals } from '../types/game';
import { FoodGroupProgress } from './FoodGroupProgress';
import { IllustratedPyramid } from './IllustratedPyramid';
export function PyramidGraphic() {
  return <IllustratedPyramid />;
}
export function FoodPyramid({ totals, onInfo, staticOpen = false, showHints = true, layout = 'list' }: { totals: FoodGroupTotals; onInfo?: () => void; staticOpen?: boolean; showHints?: boolean; layout?: 'list' | 'steps' }) {
  const [expanded, setExpanded] = useState(false);
  const filled = REQUIRED_FOOD_GROUPS.filter(g => totals[g.id] >= g.maxTarget).length;
  return <section className={`pyramid-panel ${expanded || staticOpen ? 'is-expanded' : ''} ${layout === 'steps' ? 'pyramid-steps' : ''}`} aria-label="Päeva toidupüramiid">
    <div className="pyramid-heading"><div><span className="eyebrow">IGAL AMPSUL ON OMA KOHT</span><h3>Minu toidupüramiid</h3></div>{onInfo && <button className="icon-button" onClick={onInfo} aria-label="Toidupüramiidi selgitus"><InfoCircle size={19} /></button>}</div>
    {!staticOpen && <button className="pyramid-toggle" onClick={() => setExpanded(value => !value)} aria-expanded={expanded}><span>{filled} / {REQUIRED_FOOD_GROUPS.length} põhigruppi täidetud</span>{expanded ? <NavArrowUp size={20} /> : <NavArrowDown size={20} />}</button>}
    <div className="pyramid-content">
      {layout === 'steps' ? <IllustratedPyramid totals={totals} /> : <><PyramidGraphic /><div className="group-progress-list">{FOOD_GROUPS.map(group => <FoodGroupProgress key={group.id} group={group} value={totals[group.id]} showOptionalLabel={showHints} />)}</div></>}
      {showHints && <p className="pyramid-footnote">{DAILY_GOAL_EXPLANATION}</p>}
    </div>
  </section>;
}
