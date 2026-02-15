// Types
export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image?: string;
  description?: string;
  /** Allergen ids (from ALLERGENS) */
  allergens?: string[];
  /** Si false, no se muestra en el menú público (por defecto true) */
  active?: boolean;
}

/** Allergen option for forms and display (icon mapped in UI) */
export interface AllergenOption {
  id: string;
  name: string;
}

/** List of allergens (EU 14 + common). Icon per id is in AllergenIcons component. */
export const ALLERGENS: AllergenOption[] = [
  {id: 'gluten', name: 'Gluten'},
  {id: 'crustaceans', name: 'Crustáceos'},
  {id: 'eggs', name: 'Huevos'},
  {id: 'fish', name: 'Pescado'},
  {id: 'peanuts', name: 'Cacahuetes'},
  {id: 'soy', name: 'Soja'},
  {id: 'milk', name: 'Lácteos'},
  {id: 'nuts', name: 'Frutos secos'},
  {id: 'celery', name: 'Apio'},
  {id: 'mustard', name: 'Mostaza'},
  {id: 'sesame', name: 'Sésamo'},
  {id: 'sulphites', name: 'Sulfitos'},
  {id: 'lupin', name: 'Altramuces'},
  {id: 'molluscs', name: 'Moluscos'},
];

/** Categoría del menú (gestión en admin) */
export interface Category {
  id: number;
  name: string;
}

// Storage keys
export const STORAGE_KEYS = {
  MENU_ITEMS: 'menuItems',
  SELECTION: 'selection',
  CATEGORIES: 'categories',
  /** Si el usuario ya vio el vídeo de bienvenida del menú */
  MENU_INTRO_VIDEO_SEEN: 'menuIntroVideoSeen',
};

/** URL del vídeo de bienvenida (10 s) al entrar al menú por primera vez. Poner el archivo en public/intro.mp4 */
export const MENU_INTRO_VIDEO_URL = '/intro.mp4';
export const MENU_INTRO_VIDEO_DURATION_MS = 10_000;

/** Nombres por defecto para inicializar categorías (se convierten a Category con id) */
export const DEFAULT_CATEGORY_NAMES = [
  'Entrantes',
  'Ensaladas',
  'Pizza',
  'Pasta',
  'Principales',
  'Postres',
  'Bebidas',
];

// View types
export const VIEWS = {
  ADMIN: 'admin',
  PUBLIC: 'public',
  QR: 'qr',
  MY_SELECTION: 'my-selection',
};

// Demo data
export const DEMO_MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    description: 'Tomate, mozzarella fresca y albahaca.',
    allergens: ['gluten', 'milk'],
  },
  {
    id: 2,
    name: 'Lanzarote Pizza',
    category: 'Pizza',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    description: 'Base de tomate con queso y ingredientes de la isla.',
    allergens: ['gluten', 'milk'],
  },
  {
    id: 3,
    name: 'Caesar Salad',
    category: 'Salads',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    description: 'Lechuga romana, parmesano, crutones y salsa César.',
    allergens: ['eggs', 'milk', 'gluten'],
  },
  {
    id: 4,
    name: 'Spaghetti Carbonara',
    category: 'Pasta',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    description: 'Pasta con huevo, guanciale, pecorino y pimienta negra.',
    allergens: ['gluten', 'eggs', 'milk'],
  },
];
