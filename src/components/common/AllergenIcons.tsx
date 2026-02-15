import {
  Wheat,
  Shrimp,
  Egg,
  Fish,
  CircleDot,
  Leaf,
  Milk,
  Nut,
  Carrot,
  Flame,
  Circle,
  FlaskConical,
  Flower2,
  Shell,
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {ALLERGENS} from '../../constants';

/** Map allergen id -> Lucide icon (for form checkboxes and badges) */
export const ALLERGEN_ICON_MAP: Record<string, LucideIcon> = {
  gluten: Wheat,
  crustaceans: Shrimp,
  eggs: Egg,
  fish: Fish,
  peanuts: CircleDot,
  soy: Leaf,
  milk: Milk,
  nuts: Nut,
  celery: Carrot,
  mustard: Flame,
  sesame: Circle,
  sulphites: FlaskConical,
  lupin: Flower2,
  molluscs: Shell,
};

interface AllergenIconsProps {
  /** Allergen ids to show (e.g. from MenuItem.allergens) */
  allergenIds: string[];
  /** Size of each icon in pixels */
  size?: 'sm' | 'md' | 'lg';
  /** Optional class for the container */
  className?: string;
  /** Show as compact badges (rounded) or inline */
  variant?: 'badges' | 'inline';
}

const sizeMap = {sm: 14, md: 18, lg: 22};

/**
 * Renders allergen icons as labels/badges. Use in menu cards and detail view.
 */
export function AllergenIcons({
  allergenIds,
  size = 'sm',
  variant = 'badges',
  className = '',
}: AllergenIconsProps) {
  if (!allergenIds?.length) return null;

  const px = sizeMap[size];
  const isBadge = variant === 'badges';

  return (
    <div
      className={`flex flex-wrap items-center gap-1 ${className}`}
      role='list'
      aria-label='Alérgenos'
    >
      {allergenIds.map((id) => {
        const Icon = ALLERGEN_ICON_MAP[id];
        if (!Icon) return null;
        const label = ALLERGENS.find((a) => a.id === id)?.name ?? id;
        return (
          <span
            key={id}
            role='listitem'
            className={`
              inline-flex items-center justify-center shrink-0
              ${isBadge ? 'rounded-full bg-neutral-700/80 text-white' : ''}
              ${isBadge ? 'p-1' : ''}
            `}
            title={label}
          >
            <Icon size={px} strokeWidth={2} aria-hidden />
          </span>
        );
      })}
    </div>
  );
}

export {ALLERGENS};
