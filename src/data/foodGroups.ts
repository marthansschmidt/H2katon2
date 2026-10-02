import type { FoodGroup } from '../types/game';
// Educational abstractions, NOT portions, calories or individual dietary targets.
// Principles: TAI, https://toitumine.ee/kuidas-tervislikult-toituda/toidusoovitused
// The actual food pyramid describes a longer period; this game simplifies it to one day.
export const FOOD_GROUPS: FoodGroup[] = [
  { id: 'vegetables', name: 'Köögiviljad', shortName: 'Köögiviljad', color: '#29883d', minTarget: 3, maxTarget: 7, icon: 'carrot', tip: 'Lisa taldrikule värve: näiteks porgandit, brokolit või tomatit.' },
  { id: 'fruits', name: 'Puuviljad ja marjad', shortName: 'Puuviljad', color: '#c55441', minTarget: 2, maxTarget: 5, icon: 'apple', tip: 'Vahelduseks sobivad õun, banaan või peotäis marju.' },
  { id: 'grains', name: 'Teraviljatooted ja kartul', shortName: 'Teraviljad', color: '#a57316', minTarget: 3, maxTarget: 7, icon: 'wheat', tip: 'Puder, täisteraleib, riis, pasta ja kartul kuuluvad siia.' },
  { id: 'dairy', name: 'Piim ja piimatooted', shortName: 'Piimatooted', color: '#23849d', minTarget: 1, maxTarget: 3, icon: 'milk', tip: 'Näiteks jogurt, piim, keefir või juust.' },
  { id: 'protein', name: 'Kala, muna, liha ja muud valguallikad', shortName: 'Valguallikad', color: '#8e60b0', minTarget: 2, maxTarget: 5, icon: 'egg', tip: 'Valguallikad on ka oad, läätsed, kikerherned ja tofu.' },
  { id: 'fats', name: 'Lisatavad toidurasvad, pähklid ja seemned', shortName: 'Toidurasvad', color: '#827028', minTarget: 1, maxTarget: 3, icon: 'nut', tip: 'Väike kogus õli, pähkleid või seemneid täiendab toidukorda.' },
  { id: 'treats', name: 'Maiustused ja näksid', shortName: 'Maiustused', color: '#bd5682', minTarget: 0, maxTarget: 2, icon: 'candy', tip: 'Neid ei pea iga päev sööma. Üks magustoit ei määra kogu päeva tasakaalu.' },
  { id: 'drinks', name: 'Vesi ja joogid', shortName: 'Vesi ja joogid', color: '#227ead', minTarget: 2, maxTarget: 4, icon: 'droplet', tip: 'Janu korral vali vesi.' },
];
