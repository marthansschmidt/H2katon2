import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { MealTime, Restaurant } from '../types/game';
import { MAP_SCENES } from '../data/mapScenes';
import { RestaurantMarker } from './RestaurantMarker';
import { layoutMapMarkers } from './mapLayout';
export function TartuMap({ restaurants, meal, hiddenRestaurantId, disabled = false, onSelect }: { restaurants: Restaurant[]; meal: MealTime; hiddenRestaurantId?: string; disabled?: boolean; onSelect: (restaurant: Restaurant) => void }) {
  const scene = MAP_SCENES[meal];
  const restaurantIdsKey = restaurants.map(restaurant => restaurant.id).join(',');
  const requestedScene = useRef(scene);
  const lastLoadedScene = useRef(scene);
  const [previousScene, setPreviousScene] = useState<typeof scene | null>(null);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<ReturnType<typeof layoutMapMarkers>>({ positions: [], focusX: .5, focusY: .5 });
  const [markerHeight, setMarkerHeight] = useState(0);
  useLayoutEffect(() => {
    if (requestedScene.current.src === scene.src) return;
    setPreviousScene(lastLoadedScene.current);
    setSceneLoaded(false);
    requestedScene.current = scene;
  }, [scene]);
  useEffect(() => {
    if (!previousScene || !sceneLoaded) return;
    // Keep the old scene underneath until the 650 ms fade has finished.
    // The timeout also cleans up if reduced motion disables the animation.
    const timeout = window.setTimeout(() => setPreviousScene(null), 700);
    return () => window.clearTimeout(timeout);
  }, [previousScene, sceneLoaded]);
  useEffect(() => {
    const nextMeal = meal === 'breakfast' ? 'lunch' : meal === 'lunch' ? 'dinner' : 'breakfast';
    const nextImage = new Image();
    nextImage.src = MAP_SCENES[nextMeal].src;
  }, [meal]);
  useLayoutEffect(() => {
    const map = mapRef.current!;
    const header = map.parentElement!.querySelector('.game-header')!;
    const dock = map.parentElement!.querySelector('.map-status-dock')!;
    const marker = map.querySelector('.restaurant-marker');
    if (!marker) return;
    const update = () => {
      const rect = map.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const dockRect = dock.getBoundingClientRect();
      const markerRect = marker.getBoundingClientRect();
      setMarkerHeight(markerRect.height);
      setLayout(layoutMapMarkers({ width: rect.width, height: rect.height, top: headerRect.bottom - rect.top, bottom: dockRect.top - (rect.top + window.scrollY), markerWidth: markerRect.width, markerHeight: markerRect.height, count: restaurants.length }));
    };
    const observer = new ResizeObserver(update);
    for (const element of [map, header, dock, marker]) observer.observe(element);
    update();
    return () => observer.disconnect();
  }, [restaurantIdsKey, hiddenRestaurantId]);
  return <div className="tartu-map" ref={mapRef} data-meal={meal} aria-busy={disabled}>
    {previousScene && <img className="map-art-previous" src={previousScene.src} style={{ objectPosition: `${layout.focusX * 100}% ${layout.focusY * 100}%` }} alt="" aria-hidden="true" draggable={false} />}
    <img key={scene.src} className={`map-art${previousScene ? sceneLoaded ? ' map-art-entering' : ' map-art-loading' : ''}`} src={scene.src} style={{ objectPosition: `${layout.focusX * 100}% ${layout.focusY * 100}%` }} alt={scene.alt} draggable={false} onLoad={() => {
      lastLoadedScene.current = scene;
      setSceneLoaded(true);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPreviousScene(null);
    }} />
    <div key={restaurantIdsKey} className={`map-restaurant-layer ${disabled || previousScene && !sceneLoaded ? 'is-loading' : 'is-entering'}`}>
      <svg className="map-building-links" aria-hidden="true">{layout.positions.map((position, index) => {
        if (restaurants[index]?.id === hiddenRestaurantId) return null;
        const tipY = position.y + markerHeight / 2 + 7;
        return <g key={position.building}><path d={`M ${position.x} ${tipY} L ${position.anchorX} ${position.anchorY}`} /><circle cx={position.anchorX} cy={position.anchorY} r="4" /></g>;
      })}</svg>
      {restaurants.map((restaurant, index) => restaurant.id === hiddenRestaurantId ? null : <RestaurantMarker key={restaurant.id} restaurant={restaurant} position={layout.positions[index]} disabled={disabled} onSelect={onSelect} />)}
    </div>
  </div>;
}
