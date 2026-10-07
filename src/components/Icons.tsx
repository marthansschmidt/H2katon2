import type { ComponentType, SVGProps } from 'react';
import {
  Apple as AppleIcon, ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon,
  BreadSlice as BreadSliceIcon, Check as CheckIcon, Chocolate as ChocolateIcon,
  CoffeeCup as CoffeeCupIcon, Cutlery as CutleryIcon, Droplet as DropletIcon,
  Egg as EggIcon, Fish as FishIcon, GlassHalf as GlassHalfIcon,
  HalfMoon as HalfMoonIcon, HeartSolid as HeartSolidIcon, HelpCircle as HelpCircleIcon,
  HomeSimple as HomeSimpleIcon, InfoCircle as InfoCircleIcon, Leaf as LeafIcon,
  LightBulb as LightBulbIcon, NavArrowDown as NavArrowDownIcon,
  NavArrowUp as NavArrowUpIcon, OpenBook as OpenBookIcon, PlaySolid as PlaySolidIcon,
  Restart as RestartIcon, Settings as SettingsIcon, SmartphoneDevice as SmartphoneDeviceIcon,
  Sparks as SparksIcon, Star as StarIcon, StarSolid as StarSolidIcon,
  SunLight as SunLightIcon, Triangle as TriangleIcon, Xmark as XmarkIcon,
} from 'iconoir-react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

// Keep Iconoir's 24px grid and 1.5px stroke consistent at every display size.
function gameIcon(Icon: ComponentType<SVGProps<SVGSVGElement>>, name: string) {
  return function GameIcon({ size = 24, className = '', ...props }: IconProps) {
    return <Icon width={size} height={size} strokeWidth={1.5} aria-hidden="true" focusable="false" {...props} className={`iconoir iconoir-${name} ${className}`.trim()} />;
  };
}

export const ArrowLeft = gameIcon(ArrowLeftIcon, 'arrow-left');
export const ArrowRight = gameIcon(ArrowRightIcon, 'arrow-right');
export const Check = gameIcon(CheckIcon, 'check');
export const CoffeeCup = gameIcon(CoffeeCupIcon, 'coffee-cup');
export const Cutlery = gameIcon(CutleryIcon, 'cutlery');
export const HalfMoon = gameIcon(HalfMoonIcon, 'half-moon');
export const HeartSolid = gameIcon(HeartSolidIcon, 'heart-solid');
export const HelpCircle = gameIcon(HelpCircleIcon, 'help-circle');
export const HomeSimple = gameIcon(HomeSimpleIcon, 'home-simple');
export const InfoCircle = gameIcon(InfoCircleIcon, 'info-circle');
export const Leaf = gameIcon(LeafIcon, 'leaf');
export const LightBulb = gameIcon(LightBulbIcon, 'light-bulb');
export const NavArrowDown = gameIcon(NavArrowDownIcon, 'nav-arrow-down');
export const NavArrowUp = gameIcon(NavArrowUpIcon, 'nav-arrow-up');
export const OpenBook = gameIcon(OpenBookIcon, 'open-book');
export const PlaySolid = gameIcon(PlaySolidIcon, 'play-solid');
export const Restart = gameIcon(RestartIcon, 'restart');
export function RotateCcw({ size = 24, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>;
}
export const Settings = gameIcon(SettingsIcon, 'settings');
export const SmartphoneDevice = gameIcon(SmartphoneDeviceIcon, 'smartphone-device');
export const Sparks = gameIcon(SparksIcon, 'sparks');
export const Star = gameIcon(StarIcon, 'star');
export const StarSolid = gameIcon(StarSolidIcon, 'star-solid');
export const SunLight = gameIcon(SunLightIcon, 'sun-light');
export const Triangle = gameIcon(TriangleIcon, 'triangle');
export const Xmark = gameIcon(XmarkIcon, 'xmark');

const groupIcons = {
  apple: gameIcon(AppleIcon, 'apple'),
  candy: gameIcon(ChocolateIcon, 'chocolate'),
  carrot: Leaf,
  droplet: gameIcon(DropletIcon, 'droplet'),
  egg: gameIcon(EggIcon, 'egg'),
  milk: gameIcon(GlassHalfIcon, 'glass-half'),
  nut: gameIcon(DropletIcon, 'droplet'), // Oil represents the fats, nuts and seeds group.
  wheat: gameIcon(BreadSliceIcon, 'bread-slice'),
  coffee: CoffeeCup,
  fish: gameIcon(FishIcon, 'fish'),
  leaf: Leaf,
  sandwich: gameIcon(BreadSliceIcon, 'bread-slice'),
  soup: Cutlery,
  utensils: Cutlery,
} satisfies Record<string, ComponentType<IconProps>>;

export function GroupIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = groupIcons[name as keyof typeof groupIcons] ?? Cutlery;
  return <Icon size={size} />;
}
