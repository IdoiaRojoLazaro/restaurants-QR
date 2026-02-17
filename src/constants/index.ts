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
  /** Sugerencias de maridaje / con qué combina (vino, guarnición, etc.) */
  suggestions?: string[];
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

/** Número de comensales disponibles para "Opción de grupos" */
export const COMENSALES_OPTIONS = [2, 4, 6, 8] as const;

/** Opción para compartir (menú/raciones para X personas) */
export interface SharingOption {
  id: string;
  name: string;
  description?: string;
  /** Precio total aproximado (opcional) */
  price?: number;
  /** IDs de MenuItem incluidos (para mostrar detalle o enlace) */
  menuItemIds?: number[];
}

/** Opciones "para compartir" por número de comensales (ej. "entre 4") */
export const GROUP_SHARING_OPTIONS: Record<number, SharingOption[]> = {
  2: [
    {
      id: 'compartir-2-1',
      name: 'Menú para dos',
      description: 'Selección de entrantes y principal para compartir en pareja.',
      price: 38,
      menuItemIds: [1, 2],
    },
    {
      id: 'compartir-2-2',
      name: 'Tabla para dos',
      description: 'Embutidos, quesos y pan para dos personas.',
      price: 24,
    },
  ],
  4: [
    {
      id: 'compartir-4-1',
      name: 'Menú para compartir entre 4',
      description: 'Varios entrantes y dos principales para compartir en mesa.',
      price: 72,
      menuItemIds: [1, 2, 3],
    },
    {
      id: 'compartir-4-2',
      name: 'Tabla de embutidos y quesos (4 p.)',
      description: 'Tabla grande de embutidos, quesos, pan y acompañamientos.',
      price: 45,
    },
    {
      id: 'compartir-4-3',
      name: 'Degustación casa (4 p.)',
      description: 'Cuatro entrantes y dos platos principales de la casa.',
      price: 85,
      menuItemIds: [1, 2, 3, 4],
    },
  ],
  6: [
    {
      id: 'compartir-6-1',
      name: 'Menú grupo 6 personas',
      description: 'Entrantes variados y tres principales para compartir.',
      price: 108,
    },
    {
      id: 'compartir-6-2',
      name: 'Gran tabla + platos (6 p.)',
      description: 'Tabla grande y dos platos principales para la mesa.',
      price: 95,
    },
  ],
  8: [
    {
      id: 'compartir-8-1',
      name: 'Menú para compartir entre 8',
      description: 'Carta de entrantes y principales para mesa grande.',
      price: 145,
    },
    {
      id: 'compartir-8-2',
      name: 'Banquete casa (8 p.)',
      description: 'Selección del chef para 8 personas.',
      price: 165,
    },
  ],
};

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
    allergens: ['fish'],
    suggestions: ['Vino blanco afrutado', 'Pan con tomate'],
  },
  {
    id: 2,
    name: 'Solomillo vaca premium (según peso)',
    category: 'Carnes',
    price: 10,
    image: '/solomillo.jpg',
    description: 'Base de tomate con queso y ingredientes de la isla.',
    allergens: ['gluten', 'milk'],
    suggestions: ['Vino tinto crianza', 'Puré de patatas', 'Verduras asadas'],
  },
  {
    id: 3,
    name: 'Cabra estofada con puré de papas o con papas fritas',
    category: 'Carnes',
    price: 16.5,
    image: 'estofado.jpg',
    description: 'Lechuga romana, parmesano, crutones y salsa César.',
    allergens: ['eggs', 'milk', 'gluten'],
    suggestions: ['Vino tinto reserva', 'Pan rústico', 'Ensalada verde'],
  },
  {
    id: 4,
    name: 'hamburguesa',
    category: 'Hamburguesa',
    price: 14.99,
    image: 'hamburguesa_1.jpg',
    description: 'Pasta con huevo, guanciale, pecorino y pimienta negra.',
    allergens: ['gluten', 'eggs', 'milk'],
    suggestions: ['Cerveza artesanal', 'Patatas fritas', 'Salsa brava'],
  },
];
