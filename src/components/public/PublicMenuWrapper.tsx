import {useState, useRef, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
// @ts-expect-error CategoriesView is JSX, no types
import CategoriesView from './CategoriesView';
import PublicMenuView from './PublicMenuView';
import MySelectionView from './MySelectionView';
import GroupOptionModal from './GroupOptionModal';
import AllergenFilterModal from './AllergenFilterModal';
import {getUniqueCategories} from '../../utils/helpers';
import {STORAGE_KEYS, MENU_INTRO_VIDEO_URL} from '../../constants';
import type {MenuItem} from '../../constants';

interface PublicMenuWrapperProps {
  menuItems: MenuItem[];
}

function markIntroVideoSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MENU_INTRO_VIDEO_SEEN, 'true');
  } catch {
    // ignore
  }
}

function isThursday(): boolean {
  return new Date().getDay() === 4; // 0 = domingo, 4 = jueves
}

function getThursdayPopupSeenDate(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.THURSDAY_BURGER_POPUP_DATE);
  } catch {
    return null;
  }
}

function markThursdayPopupSeen(): void {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    localStorage.setItem(STORAGE_KEYS.THURSDAY_BURGER_POPUP_DATE, today);
  } catch {
    // ignore
  }
}

function getFirstBurger(items: MenuItem[]): MenuItem | undefined {
  return items.find((item) =>
    item.category.toLowerCase().includes('hamburguesa'),
  );
}

/** Resuelve la URL de una imagen del menú (relativa o absoluta). Con base: './' las relativas se resuelven desde la raíz del sitio. */
function getImageUrl(image: string | undefined): string {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/')) {
    return image;
  }
  const base = import.meta.env.BASE_URL ?? './';
  const basePath = base === '/' ? '' : base.replace(/\/$/, '');
  return `${basePath}/${image}`.replace(/\/+/g, '/');
}

const PublicMenuWrapper = ({menuItems}: PublicMenuWrapperProps) => {
  const [searchParams] = useSearchParams();
  const platoIdParam = searchParams.get('plato');
  const platoIdFromUrl = platoIdParam ? parseInt(platoIdParam, 10) : null;
  const validPlatoId =
    platoIdFromUrl != null && !Number.isNaN(platoIdFromUrl)
      ? platoIdFromUrl
      : null;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showIntroVideo, setShowIntroVideo] = useState(true);
  const [showThursdayBurgerPopup, setShowThursdayBurgerPopup] = useState(false);
  const [showFavoritesView, setShowFavoritesView] = useState(false);
  const [showGroupOption, setShowGroupOption] = useState(false);
  const [showAllergenFilter, setShowAllergenFilter] = useState(false);
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeItems = menuItems.filter((item) => item.active !== false);
  const categories = getUniqueCategories(activeItems);
  const firstBurger = getFirstBurger(activeItems);

  // Deep link: si la URL tiene ?plato=id, ir al plato (y saltar el vídeo para que se vea el plato al instante)
  useEffect(() => {
    if (validPlatoId == null || activeItems.length === 0) return;
    const item = activeItems.find((i) => i.id === validPlatoId);
    if (item) {
      setShowIntroVideo(false);
      setSelectedCategory(item.category);
    }
  }, [validPlatoId, activeItems]);

  const closeIntroVideo = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    markIntroVideoSeen();
    setShowIntroVideo(false);
    // Mostrar popup "Jueves de hamburguesa" la primera vez que entras (un día por jueves)
    if (isThursday() && firstBurger) {
      const today = new Date().toISOString().slice(0, 10);
      if (getThursdayPopupSeenDate() !== today) {
        setShowThursdayBurgerPopup(true);
      }
    }
  };

  const closeThursdayPopup = () => {
    markThursdayPopupSeen();
    setShowThursdayBurgerPopup(false);
  };

  return (
    <div className='min-h-screen w-full bg-white'>
      {/* Vídeo de bienvenida (solo la primera vez) */}
      {showIntroVideo && (
        <div className='fixed inset-0 z-50 bg-black flex items-center justify-center'>
          <video
            key={MENU_INTRO_VIDEO_URL}
            src={MENU_INTRO_VIDEO_URL}
            className='w-full h-full object-cover'
            autoPlay
            muted
            playsInline
            preload='auto'
            onEnded={closeIntroVideo}
            onError={(e) => {
              console.warn(
                'Intro video no pudo cargar:',
                (e.target as HTMLVideoElement)?.error?.message ??
                  MENU_INTRO_VIDEO_URL,
              );
              closeIntroVideo();
            }}
          />
          <button
            type='button'
            onClick={closeIntroVideo}
            className='absolute top-4 right-4 px-4 py-2 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors'
          >
            Saltar
          </button>
        </div>
      )}

      {showFavoritesView ? (
        <div className='min-h-screen h-screen flex flex-col'>
          <MySelectionView
            menuItems={activeItems}
            onBack={() => setShowFavoritesView(false)}
          />
        </div>
      ) : selectedCategory === null ? (
        <CategoriesView
          categories={categories}
          menuItems={activeItems}
          onSelectCategory={setSelectedCategory}
          onOpenGroupOption={() => setShowGroupOption(true)}
          onOpenFilters={() => setShowAllergenFilter(true)}
          onGoToFavorites={() => setShowFavoritesView(true)}
          filterActive={selectedAllergenIds.length > 0}
        />
      ) : (
        <PublicMenuView
          menuItems={activeItems}
          selectedCategory={selectedCategory}
          onBackToCategories={() => setSelectedCategory(null)}
          onOpenFilters={() => setShowAllergenFilter(true)}
          onGoToFavorites={() => setShowFavoritesView(true)}
          filterActive={selectedAllergenIds.length > 0}
          selectedAllergenIds={selectedAllergenIds}
          initialItemId={validPlatoId ?? undefined}
        />
      )}

      <GroupOptionModal
        isOpen={showGroupOption}
        onClose={() => setShowGroupOption(false)}
        menuItems={activeItems}
      />

      <AllergenFilterModal
        isOpen={showAllergenFilter}
        onClose={() => setShowAllergenFilter(false)}
        selectedAllergenIds={selectedAllergenIds}
        onSelectionChange={setSelectedAllergenIds}
      />

      {/* Popup "Jueves de hamburguesa" (solo jueves, primera vez al entrar) */}
      {showThursdayBurgerPopup && firstBurger && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60'
          role='dialog'
          aria-modal='true'
          aria-labelledby='thursday-popup-title'
        >
          <div className='bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden'>
            <div className='aspect-4/3 w-full overflow-hidden'>
              <img
                src={getImageUrl(firstBurger.image)}
                alt={firstBurger.name}
                className='w-full h-full object-cover'
              />
            </div>
            <div className='p-5 text-center'>
              <h2
                id='thursday-popup-title'
                className='text-xl font-semibold text-neutral-800 mb-3'
                style={{fontFamily: 'var(--font-elegant)'}}
              >
                Hoy es jueves de hamburguesa
              </h2>
              <button
                type='button'
                onClick={closeThursdayPopup}
                className='w-full py-3 px-4 rounded-xl bg-neutral-800 text-white font-medium hover:bg-neutral-700 transition-colors'
              >
                Ver menú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicMenuWrapper;
