import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState } from 'react';
import { FOOD_GROUPS } from '../data/foodGroups';
import type { FoodGroupTotals } from '../types/game';
import { FoodGroupProgress } from './FoodGroupProgress';
import { FoodIllustration } from './FoodIllustration';
import { GroupIcon } from './Icons';
export function PyramidGraphic() {
  return <div className="pyramid-graphic" aria-label="Toidupüramiid: maiustusi vähem, köögivilju, puuvilju ja teravilju rohkem" role="img">
    <div className="pyramid-tier tier-one"><FoodIllustration type="cake" /></div>
    <div className="pyramid-tier tier-two"><GroupIcon name="nut" size={32} /></div>
    <div className="pyramid-tier tier-three"><span><FoodIllustration type="yogurt" /></span><span><FoodIllustration type="fish" /><FoodIllustration type="toast" /></span></div>
    <div className="pyramid-tier tier-four"><span><FoodIllustration type="salad" /></span><span><FoodIllustration type="fruit" /></span><span><FoodIllustration type="porridge" /></span></div>
  </div>;
}
export function FoodPyramid({ totals, onInfo, staticOpen = false }: { totals: FoodGroupTotals; onInfo?: () => void; staticOpen?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const filled = FOOD_GROUPS.filter(g => totals[g.id] > 0).length;
  return <section className={`pyramid-panel ${expanded || staticOpen ? 'is-expanded' : ''}`} aria-label="Päeva toidupüramiid">
    <div className="pyramid-heading"><div><span className="eyebrow">IGAL AMPSUL ON OMA KOHT</span><h3>Minu toidupüramiid</h3></div>{onInfo && <button className="icon-button" onClick={onInfo} aria-label="Toidupüramiidi selgitus"><Info size={19} /></button>}</div>
    {!staticOpen && <button className="pyramid-toggle" onClick={() => setExpanded(value => !value)} aria-expanded={expanded}><span>{filled} / 8 gruppi avastatud</span>{expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>}
    <div className="pyramid-content"><PyramidGraphic /><div className="group-progress-list">{FOOD_GROUPS.map(group => <FoodGroupProgress key={group.id} group={group} value={totals[group.id]} />)}</div><p className="pyramid-footnote">Mummud on mänguühikud. Tasakaal kujuneb päeva jooksul.</p></div>
  </section>;
}
