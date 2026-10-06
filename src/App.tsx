import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from './components/Icons';
import { HomeScreen } from './pages/HomeScreen';
import { TutorialScreen, TutorialSteps } from './pages/TutorialScreen';
import { GameMapScreen } from './pages/GameMapScreen';
import { DaySummaryScreen } from './pages/DaySummaryScreen';
import { FinalSummaryScreen } from './pages/FinalSummaryScreen';
import { Modal } from './components/Modal';
import { Button } from './components/Button';
import { PyramidGuide } from './components/PyramidGuide';
import { GameShell } from './components/GameShell';
import { FeedbackModal } from './components/FeedbackModal';
import { RestaurantModal } from './components/RestaurantModal';
import { chooseFood, createPlayerState, nextDay, nextMeal } from './game/state';
import { foodsForDay, totalsForDay } from './game/foodPyramid';
import { loadGame, saveGame } from './game/storage';
import { getMealsForRestaurant, getRestaurantById, getRestaurantsForMeal } from './services/restaurantService';
import type { Food, Restaurant, Screen } from './types/game';

export default function App() {
  const [saved] = useState(loadGame);
  const [player, setPlayer] = useState(saved?.player ?? createPlayerState());
  const [screen, setScreen] = useState<Screen>(saved?.screen ?? 'home');
  const [resumeScreen, setResumeScreen] = useState<Screen>(saved?.resumeScreen ?? 'tutorial');
  const [hasStarted, setHasStarted] = useState(saved?.started ?? false);
  const [guide, setGuide] = useState<'tutorial' | 'pyramid' | null>(null);
  const [pyramidReminder, setPyramidReminder] = useState(0);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const requestId = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const dayNumber = player.currentDay;
  const mealTime = player.currentMeal;
  const restaurantIdsKey = player.restaurantIds.join(',');

  useEffect(() => { setStorageAvailable(saveGame(player, screen, resumeScreen, hasStarted)); }, [player, screen, resumeScreen, hasStarted]);
  useEffect(() => { mainRef.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); setMobileNav(false); }, [screen, dayNumber]);
  useEffect(() => {
    if (screen !== 'map') return;
    let cancelled = false;
    setLoading(true); setError(null);
    async function loadRestaurants() {
      try {
        const list = player.restaurantIds.length ? (await Promise.all(player.restaurantIds.map(getRestaurantById))).filter((r): r is Restaurant => r !== null) : await getRestaurantsForMeal(player.usedRestaurantIds, player.previousRestaurantIds);
        if (cancelled) return;
        if (!list.length) throw new Error('empty');
        setRestaurants(list);
        if (!player.restaurantIds.length) setPlayer(previous => ({ ...previous, restaurantIds: list.map(r => r.id), usedRestaurantIds: [...new Set([...previous.usedRestaurantIds, ...list.map(r => r.id)])] }));
      } catch { if (!cancelled) setError('Tänase menüü avamine ei õnnestunud. Proovi uuesti.'); }
      finally { if (!cancelled) setLoading(false); }
    }
    void loadRestaurants();
    return () => { cancelled = true; };
    // Food and mood updates must not reroll the current meal's selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, dayNumber, mealTime, restaurantIdsKey, retry]);

  const goTo = (nextScreen: Screen) => { setScreen(nextScreen); if (nextScreen !== 'home') setResumeScreen(nextScreen); };
  const openPyramid = () => setGuide('pyramid');
  function startGame() {
    requestId.current++; setSelected(null); setRestaurants([]); setError(null);
    setPyramidReminder(0);
    setPlayer(createPlayerState()); setHasStarted(true); goTo('tutorial');
  }
  async function openRestaurant(restaurant: Restaurant) {
    if (loading || player.days[dayNumber - 1][player.currentMeal]) return;
    const currentRequest = ++requestId.current;
    setSelected(restaurant); setMenuError(null);
    if (player.offers[restaurant.id]) { setFoodsLoading(false); return; }
    setFoodsLoading(true);
    const meal = player.currentMeal;
    const day = player.currentDay;
    try {
      const foods = await getMealsForRestaurant(restaurant.id, meal, player.usedFoodIds, { totals: player.foodGroupTotals, selectedFoodIds: foodsForDay(player.days[day - 1]).map(food => food.id) });
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
    setPyramidReminder(previous => previous + 1);
    if (player.currentMeal === 'dinner') goTo('daySummary');
    else {
      requestId.current++; setSelected(null); setLoading(true);
      setPlayer(previous => nextMeal(previous));
    }
  }
  function advanceDay() {
    if (dayNumber === 3) goTo('final');
    else { setRestaurants([]); setPlayer(previous => nextDay(previous)); goTo('map'); }
  }
  return <GameShell screen={screen} mainRef={mainRef} menuOpen={mobileNav} onMenu={() => setMobileNav(v => !v)} onHome={() => goTo('home')} onTutorial={() => { setMobileNav(false); setGuide('tutorial'); }}>
    <>
      {screen === 'home' && <HomeScreen onStart={startGame} onTutorial={() => setGuide('tutorial')} onPyramid={openPyramid} hasStarted={hasStarted} />}
      {screen === 'tutorial' && <TutorialScreen onBegin={() => goTo('map')} onBack={() => goTo('home')} />}
      {screen === 'map' && <GameMapScreen player={player} restaurants={restaurants} onRestaurant={r => void openRestaurant(r)} onPyramid={() => { setPyramidReminder(0); openPyramid(); }} pyramidReminder={pyramidReminder} loading={loading} error={error} onRetry={() => setRetry(v => v + 1)} />}
      {screen === 'daySummary' && <DaySummaryScreen player={player} onNext={advanceDay} onPyramid={openPyramid} />}
      {screen === 'final' && <FinalSummaryScreen player={player} onRestart={startGame} onHome={() => goTo('home')} onPyramid={openPyramid} />}
    </>
    {selected && <RestaurantModal restaurant={selected} foods={player.offers[selected.id] ?? []} totals={player.foodGroupTotals} meal={player.currentMeal} loading={foodsLoading} error={menuError} onChoose={selectFood} onClose={() => { requestId.current++; setSelected(null); }} />}
    {currentFood && <FeedbackModal food={currentFood} previousTotals={totalsForDay({ ...player.days[dayNumber - 1], [player.currentMeal]: undefined })} moodScore={player.moodScore} meal={player.currentMeal} onContinue={continueAfterFood} />}
    {guide && <Modal title={guide === 'tutorial' ? 'Kuidas mängida?' : 'Toidupüramiid'} className={guide === 'pyramid' ? 'pyramid-guide-modal' : guide === 'tutorial' ? 'tutorial-guide-modal' : ''} onClose={() => setGuide(null)}>{guide === 'tutorial' ? <div className="tutorial-guide"><TutorialSteps /><Button onClick={() => setGuide(null)}>Sain aru! <ArrowRight size={18} /></Button></div> : <PyramidGuide totals={player.foodGroupTotals} />}</Modal>}
    {!storageAvailable && <div className="storage-note" role="status">Brauser ei luba mängu salvestada. Seiklus jätkub selles aknas.</div>}
  </GameShell>;
}
