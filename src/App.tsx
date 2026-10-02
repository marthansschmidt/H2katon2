import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, Check, CircleHelp, Home, Leaf, Menu, Sparkles, X } from 'lucide-react';
import { HomeScreen } from './pages/HomeScreen';
import { TutorialScreen, TutorialSteps } from './pages/TutorialScreen';
import { GameMapScreen } from './pages/GameMapScreen';
import { DaySummaryScreen } from './pages/DaySummaryScreen';
import { FinalSummaryScreen } from './pages/FinalSummaryScreen';
import { Modal } from './components/Modal';
import { Button } from './components/Button';
import { PyramidGuide } from './components/PyramidGuide';
import { RaccoonCharacter } from './components/RaccoonCharacter';
import { RestaurantModal } from './components/RestaurantModal';
import { GroupIcon } from './components/Icons';
import { FoodPyramid } from './components/FoodPyramid';
import { FOOD_GROUPS } from './data/foodGroups';
import { chooseFood, createPlayerState, drinkWater, nextDay, nextMeal } from './game/state';
import { loadGame, saveGame } from './game/storage';
import { getMealsForRestaurant, getRestaurantById, getRestaurantsForDay } from './services/restaurantService';
import type { Food, Restaurant, Screen } from './types/game';

export default function App() {
  const [saved] = useState(loadGame);
  const [player, setPlayer] = useState(saved?.player ?? createPlayerState());
  const [screen, setScreen] = useState<Screen>(saved?.screen ?? 'home');
  const [resumeScreen, setResumeScreen] = useState<Screen>(saved?.resumeScreen ?? 'tutorial');
  const [hasStarted, setHasStarted] = useState(saved?.started ?? false);
  const [guide, setGuide] = useState<'tutorial' | 'pyramid' | 'progress' | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState('');
  const [storageAvailable, setStorageAvailable] = useState(true);
  const requestId = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const dayNumber = player.currentDay;
  const restaurantIdsKey = player.restaurantIds.join(',');

  useEffect(() => { setStorageAvailable(saveGame(player, screen, resumeScreen, hasStarted)); }, [player, screen, resumeScreen, hasStarted]);
  useEffect(() => { mainRef.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); setMobileNav(false); }, [screen, dayNumber]);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2500);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    if (screen !== 'map') return;
    let cancelled = false;
    setLoading(true); setError(null);
    async function loadRestaurants() {
      try {
        const list = player.restaurantIds.length ? (await Promise.all(player.restaurantIds.map(getRestaurantById))).filter((r): r is Restaurant => r !== null) : await getRestaurantsForDay(player.usedRestaurantIds);
        if (cancelled) return;
        if (!list.length) throw new Error('empty');
        setRestaurants(list);
        if (!player.restaurantIds.length) setPlayer(previous => ({ ...previous, restaurantIds: list.map(r => r.id), usedRestaurantIds: [...new Set([...previous.usedRestaurantIds, ...list.map(r => r.id)])] }));
      } catch { if (!cancelled) setError('Tänase menüü avamine ei õnnestunud. Proovi uuesti.'); }
      finally { if (!cancelled) setLoading(false); }
    }
    void loadRestaurants();
    return () => { cancelled = true; };
    // Food and mood updates must not reroll the day's restaurant selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, dayNumber, restaurantIdsKey, retry]);

  const goTo = (nextScreen: Screen) => { setToast(''); setScreen(nextScreen); if (nextScreen !== 'home') setResumeScreen(nextScreen); };
  function startGame() {
    requestId.current++; setSelected(null); setRestaurants([]); setError(null); setToast('');
    setPlayer(createPlayerState()); setHasStarted(true); goTo('tutorial');
  }
  async function openRestaurant(restaurant: Restaurant) {
    const currentRequest = ++requestId.current;
    setSelected(restaurant); setMenuError(null);
    if (player.offers[restaurant.id]) { setFoodsLoading(false); return; }
    setFoodsLoading(true);
    const meal = player.currentMeal;
    const day = player.currentDay;
    try {
      const foods = await getMealsForRestaurant(restaurant.id, meal, player.usedFoodIds);
      if (currentRequest !== requestId.current) return;
      if (!foods.length) throw new Error('empty');
      setPlayer(previous => previous.currentDay !== day || previous.currentMeal !== meal ? previous : ({ ...previous, offers: { ...previous.offers, [restaurant.id]: foods }, usedFoodIds: [...new Set([...previous.usedFoodIds, ...foods.map(food => food.id)])] }));
    } catch { if (currentRequest === requestId.current) setMenuError('Menüü ei avanenud. Sulge see vaade ja proovi söögikohta uuesti.'); }
    finally { if (currentRequest === requestId.current) setFoodsLoading(false); }
  }
  function selectFood(food: Food) {
    if (!selected) return;
    const name = selected.name;
    requestId.current++; setSelected(null);
    setPlayer(previous => chooseFood(previous, food, name));
  }
  const currentFood = screen === 'map' ? player.days[dayNumber - 1][player.currentMeal] : undefined;
  function continueAfterFood() {
    if (player.currentMeal === 'dinner') goTo('daySummary');
    else { setPlayer(previous => nextMeal(previous)); setToast('Uus toidukord, uued võimalused!'); }
  }
  function advanceDay() {
    if (dayNumber === 3) goTo('final');
    else { setRestaurants([]); setPlayer(previous => nextDay(previous)); goTo('map'); }
  }
  return <div className="app-shell"><a className="skip-link" href="#main-content">Liigu põhisisuni</a><header className="site-header"><div className="header-inner"><button className="brand" onClick={() => goTo('home')} aria-label="Pesukaru toiduseiklus, peamenüü"><span className="brand-icon"><RaccoonCharacter small /></span><span>pesukaru<span>toiduseiklus</span></span></button><nav className={mobileNav ? 'nav-open' : ''} aria-label="Peamenüü"><button className={screen === 'home' ? 'nav-active' : ''} onClick={() => goTo('home')}><Home size={16} />Avaleht</button><button onClick={() => setGuide('tutorial')}><CircleHelp size={16} />Kuidas mängida?</button><button onClick={() => setGuide('pyramid')}><BookOpen size={16} />Toidupüramiid</button></nav><span className="header-location"><MapPinIcon />Tartu ootab!</span><button className="mobile-menu-button icon-button" onClick={() => setMobileNav(v => !v)} aria-label={mobileNav ? 'Sulge menüü' : 'Ava menüü'} aria-expanded={mobileNav}>{mobileNav ? <X size={23} /> : <Menu size={23} />}</button></div></header>
    <div id="main-content" className="main-container" tabIndex={-1} ref={mainRef}>
      {screen === 'home' && <HomeScreen onStart={startGame} onTutorial={() => setGuide('tutorial')} onPyramid={() => setGuide('pyramid')} onResume={hasStarted ? () => goTo(resumeScreen) : undefined} />}
      {screen === 'tutorial' && <TutorialScreen onBegin={() => goTo('map')} />}
      {screen === 'map' && <GameMapScreen player={player} restaurants={restaurants} onRestaurant={r => void openRestaurant(r)} onWater={() => { setPlayer(previous => drinkWater(previous)); setToast('+1 vee ja jookide mumm. Väike kosutus!'); }} onPyramid={() => setGuide('pyramid')} onProgress={() => setGuide('progress')} loading={loading} error={error} onRetry={() => setRetry(v => v + 1)} />}
      {screen === 'daySummary' && <DaySummaryScreen player={player} onNext={advanceDay} onPyramid={() => setGuide('pyramid')} />}
      {screen === 'final' && <FinalSummaryScreen player={player} onRestart={startGame} onHome={() => goTo('home')} onPyramid={() => setGuide('pyramid')} />}
    </div><footer className="site-footer"><span><Leaf size={14} />Väikesed valikud, suured avastused.</span><span>Loodud uudishimulikele maitseavastajatele · 16–19</span><span>Toitumispõhimõtted: <a href="https://toitumine.ee/kuidas-tervislikult-toituda/toidusoovitused" target="_blank" rel="noreferrer">toitumine.ee ↗</a></span></footer>
    {selected && <RestaurantModal restaurant={selected} foods={player.offers[selected.id] ?? []} meal={player.currentMeal} loading={foodsLoading} error={menuError} onChoose={selectFood} onClose={() => { requestId.current++; setSelected(null); }} />}
    {currentFood && <Modal title="Üks uus maitse avastatud!" onClose={continueAfterFood}><div className="choice-feedback"><RaccoonCharacter moodScore={player.moodScore} /><span className="choice-check"><Check size={25} /></span><h3>{currentFood.name}</h3><p>Mõnus! Need mummud said sinu päevale juurde.</p><div className="added-groups">{currentFood.groups.map(value => { const group = FOOD_GROUPS.find(g => g.id === value.groupId)!; return <span key={value.groupId} style={{ color: group.color }}><GroupIcon name={group.icon} size={18} />+{value.points} {group.shortName.toLowerCase()}</span>; })}</div><p className="choice-tip"><Sparkles size={16} />Iga toit on osa päeva tervikust.</p><Button onClick={continueAfterFood}>{player.currentMeal === 'dinner' ? 'Vaata päeva kokkuvõtet' : player.currentMeal === 'breakfast' ? 'Edasi lõunasöögile' : 'Edasi õhtusöögile'}<ArrowRight size={18} /></Button></div></Modal>}
    {guide && <Modal title={guide === 'tutorial' ? 'Kuidas mängida?' : guide === 'progress' ? 'Minu päeva mummud' : 'Avasta toidupüramiidi'} onClose={() => setGuide(null)}>{guide === 'tutorial' ? <><TutorialSteps /><p className="tutorial-note">3 päeva × 3 toidukorda. Toidugrupi mummud näitavad päeva tervikut. Janu korral saad kaardivaates juua vett.</p><Button onClick={() => setGuide(null)}>Sain aru! <ArrowRight size={18} /></Button></> : guide === 'progress' ? <FoodPyramid totals={player.foodGroupTotals} staticOpen /> : <PyramidGuide />}</Modal>}
    {toast && <div className="toast" role="status"><Check size={17} />{toast}</div>}
    {!storageAvailable && <div className="storage-note" role="status">Brauser ei luba mängu salvestada. Seiklus jätkub selles aknas.</div>}
  </div>;
}
function MapPinIcon() { return <span className="location-dot" aria-hidden="true" />; }
