import { Apple, Candy, Carrot, Coffee, Droplets, Egg, Fish, Leaf, Milk, Nut, Sandwich, Soup, Utensils, Wheat } from 'lucide-react';
export function GroupIcon({ name, size = 18 }: { name: string; size?: number }) {
  const Icon = ({ apple: Apple, candy: Candy, carrot: Carrot, droplet: Droplets, egg: Egg, milk: Milk, nut: Nut, wheat: Wheat, coffee: Coffee, fish: Fish, leaf: Leaf, sandwich: Sandwich, soup: Soup, utensils: Utensils } as Record<string, typeof Apple>)[name] ?? Utensils;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
