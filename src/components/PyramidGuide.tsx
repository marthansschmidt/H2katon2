import { FOOD_GROUPS } from '../data/foodGroups';
import { PyramidGraphic } from './FoodPyramid';
import { GroupIcon } from './Icons';
export function PyramidGuide() {
  return <div className="pyramid-guide"><p className="muted">Erinevad toidugrupid annavad erinevaid toitaineid. Vaheldus loeb!</p><PyramidGraphic />
    <div className="guide-groups">{FOOD_GROUPS.map(group => <div key={group.id}><span className="guide-icon" style={{ color: group.color }}><GroupIcon name={group.icon} size={22} /></span><div><strong>{group.name}</strong><p>{group.tip}</p></div></div>)}</div>
    <div className="info-note"><strong>Mängu mumm ≠ toiduportsjon</strong><p>Vahemikud on lihtsustatud mängureeglid, mitte sinu toitumisnormid ega meditsiiniline nõuanne. Päris toidupüramiid vaatleb pikemat perioodi kui üks päev. Taimseid valguallikaid loeme mängus valguallikate hulka.</p><p>Sisuline alus: Tervise Arengu Instituudi <a href="https://toitumine.ee/kuidas-tervislikult-toituda/toidusoovitused" target="_blank" rel="noreferrer">toitumine.ee toidusoovitused ↗</a>.</p></div>
  </div>;
}
