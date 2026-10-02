import { FOOD_GROUPS } from '../data/foodGroups';
import { calculateDayBalance } from './foodPyramid';
import type { FoodGroupTotals } from '../types/game';
export function generateDayFeedback(totals: FoodGroupTotals): string[] {
  const balance = calculateDayBalance(totals);
  const feedback = [balance >= 75 ? 'Täna said kokku päris mitmekesise päeva. Mõnus maitseseiklus!' : 'Iga valik on osa suuremast pildist. Täna avastasid uusi maitseid!'];
  const low = FOOD_GROUPS.filter(g => g.minTarget > 0 && totals[g.id] < g.minTarget).sort((a, b) => totals[a.id] / a.minTarget - totals[b.id] / b.minTarget);
  const high = FOOD_GROUPS.filter(g => totals[g.id] > g.maxTarget).sort((a, b) => totals[b.id] - b.maxTarget - (totals[a.id] - a.maxTarget));
  if (high.length) feedback.push(`${high[0].shortName}: seda gruppi kogunes täna päris palju. Järgmine kord saad katsetada rohkem vaheldust.`);
  if (low.length) feedback.push(`${low[0].shortName}: sellest grupist jäi täna veidi puudu. Homme on uus võimalus midagi juurde proovida.`);
  const filled = FOOD_GROUPS.filter(g => g.minTarget > 0 && totals[g.id] >= g.minTarget && totals[g.id] <= g.maxTarget);
  if (feedback.length < 3 && filled.length) feedback.push(`${filled.slice(0, 2).map(g => g.shortName).join(' ja ')} said tänases mängus mõnusalt täidetud.`);
  if (feedback.length < 3) feedback.push('Üksik toit ei määra päeva tasakaalu. Vaata alati päeva tervikut.');
  return feedback.slice(0, 3);
}
