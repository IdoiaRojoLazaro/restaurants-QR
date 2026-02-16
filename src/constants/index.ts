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

/** URL del vídeo de bienvenida. Archivo en public/intro.mp4 (Vite sirve public/ en la raíz). */
export const MENU_INTRO_VIDEO_URL =
  (import.meta.env.BASE_URL === '/'
    ? ''
    : import.meta.env.BASE_URL.replace(/\/$/, '')) + '/intro.mp4';
/** Si prefieres un vídeo de YouTube, pega aquí la URL completa (ej: https://www.youtube.com/watch?v=XXXXX). Si está definido, se usará en lugar de MENU_INTRO_VIDEO_URL */
export const MENU_INTRO_VIDEO_YOUTUBE_URL: string | undefined = undefined;
export const MENU_INTRO_VIDEO_DURATION_MS = 10_000;

/** Nombres por defecto para inicializar categorías (se convierten a Category con id) */
export const DEFAULT_CATEGORY_NAMES = [
  'Para picar / entrantes',
  'Ensaladas y vegetales',
  'Plato principal',
  'Postres',
  'Vinos',
  'Bebidas',
  'Cerveza',
  'Ginebra',
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
    name: 'Ensalada de ventresca de atún sobre encebollado, manzana y puerro',
    category: 'Ensaladas y vegetales',
    price: 17,
    image: '/ventresca.jpg',
    description: '',
    allergens: ['pescado'],
  },
  {
    id: 2,
    name: 'Solomillo vaca premium (según peso)',
    category: 'Carnes',
    price: 10,
    image: '/solomillo.jpg',
    description: 'Base de tomate con queso y ingredientes de la isla.',
    allergens: ['gluten', 'milk'],
  },
  {
    id: 3,
    name: 'Cabra estofada con puré de papas o con papas fritas',
    category: 'Carnes',
    price: 16.5,
    image: 'estofado.jpg',
    description: 'Lechuga romana, parmesano, crutones y salsa César.',
    allergens: ['eggs', 'milk', 'gluten'],
  },
  {
    id: 4,
    name: 'hamburguesa',
    category: 'Hamburguesa',
    price: 14.99,
    image: 'hamburguesa_1.jpg',
    description: 'Pasta con huevo, guanciale, pecorino y pimienta negra.',
    allergens: ['gluten', 'eggs', 'milk'],
  },
];
