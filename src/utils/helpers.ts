import type {MenuItem} from '../constants';
import {ROUTES} from '../constants';

/**
 * Format price to display with currency symbol
 */
export const formatPrice = (price: number): string => {
  return `${parseFloat(String(price)).toFixed(2)} €`;
};

/**
 * Get unique categories from menu items
 */
export const getUniqueCategories = (menuItems: MenuItem[]): string[] => {
  return [...new Set(menuItems.map((item) => item.category))];
};

/**
 * Generate unique ID based on timestamp
 */
export const generateId = (): number => {
  return Date.now();
};

/**
 * Group menu items by category
 */
export const groupByCategory = (
  menuItems: MenuItem[],
): Record<string, MenuItem[]> => {
  return menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
};

export interface MenuItemFormData {
  name: string;
  category: string;
  price: string | number;
  image?: string;
  videoUrl?: string;
  description?: string;
  /** Allergen ids (from ALLERGENS) */
  allergens?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate menu item data
 */
export const validateMenuItem = (
  item: Partial<MenuItemFormData>,
): ValidationResult => {
  const errors: string[] = [];

  if (!item.name || String(item.name).trim() === '') {
    errors.push('El nombre del plato es obligatorio');
  }

  if (!item.category || String(item.category).trim() === '') {
    errors.push('La categoría es obligatoria');
  }

  if (
    item.price === undefined ||
    item.price === '' ||
    parseFloat(String(item.price)) <= 0
  ) {
    errors.push('Introduce un precio válido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format date to readable string
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Build the full URL to the public carta (for sharing).
 * If platoId is provided, adds ?plato=id so opening the link can deep-link to that dish.
 */
export const getPublicCartaUrl = (platoId?: number): string => {
  if (typeof window === 'undefined') return '';
  const base = `${window.location.origin}${window.location.pathname}`.replace(/\/$/, '') || window.location.origin;
  const hash = `${ROUTES.PUBLIC}${platoId != null ? `?plato=${platoId}` : ''}`;
  return `${base}#${hash}`;
};

/**
 * Build WhatsApp share URL for a menu item.
 * Shares the link to the carta (with deep link to this dish) and the dish name so the preview looks good.
 */
export const getWhatsAppShareUrl = (
  item: MenuItem,
  _categoryTitle: string,
): string => {
  const cartaUrl = getPublicCartaUrl(item.id);
  const text = `🍽 ${item.name}\n\nVer en la carta: ${cartaUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};
