import {useState, useEffect, useRef} from 'react';
import MenuItemCard from './MenuItemCard';
import DishDetailView from './DishDetailView';
import {getUniqueCategories} from '../../utils/helpers';
import {useSelection} from '../../hooks/useSelection';
import {
  STORAGE_KEYS,
  MENU_INTRO_VIDEO_URL,
  MENU_INTRO_VIDEO_DURATION_MS,
} from '../../constants';
import type {MenuItem} from '../../constants';

interface PublicMenuViewProps {
  menuItems: MenuItem[];
}

function hasSeenIntroVideo(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.MENU_INTRO_VIDEO_SEEN) === 'true';
  } catch {
    return false;
  }
}

function markIntroVideoSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MENU_INTRO_VIDEO_SEEN, 'true');
  } catch {
    // ignore
  }
}

const PublicMenuView = ({menuItems}: PublicMenuViewProps) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {isSaved, toggleSaved} = useSelection();
  const activeItems = menuItems.filter((item) => item.active !== false);
  const categories = getUniqueCategories(activeItems);

  useEffect(() => {
    if (!hasSeenIntroVideo()) setShowIntroVideo(true);
  }, []);

  useEffect(() => {
    if (!showIntroVideo) return;
    timeoutRef.current = setTimeout(() => {
      markIntroVideoSeen();
      setShowIntroVideo(false);
    }, MENU_INTRO_VIDEO_DURATION_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showIntroVideo]);

  const closeIntroVideo = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    markIntroVideoSeen();
    setShowIntroVideo(false);
  };

  const openDetail = (item: MenuItem, category: string) => {
    setSelectedItem(item);
    setSelectedCategory(category);
  };

  const closeDetail = () => {
    setSelectedItem(null);
    setSelectedCategory(null);
  };

  return (
    <div className='min-h-full min-h-screen bg-black text-white w-full'>
      {/* Vídeo de bienvenida (solo la primera vez, 10 s) */}
      {showIntroVideo && (
        <div className='fixed inset-0 z-50 bg-black flex items-center justify-center'>
          <video
            src={MENU_INTRO_VIDEO_URL}
            className='w-full h-full object-contain'
            autoPlay
            muted
            playsInline
            onEnded={closeIntroVideo}
            onError={closeIntroVideo}
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

      <div className='max-w-4xl mx-auto px-4 py-8 md:py-12'>
        <header className='text-center mb-10 md:mb-14'>
          <h1
            className='text-3xl md:text-4xl font-semibold tracking-wide text-white mb-2'
            style={{fontFamily: 'var(--font-elegant)'}}
          >
            Nuestro menú
          </h1>
          <p className='text-neutral-400 text-xs md:text-sm tracking-widest uppercase'>
            Toca un plato para ver el detalle · Escanea el QR de tu ticket para
            valorar
          </p>
        </header>

        {categories.length === 0 ? (
          <div className='text-center py-20 text-neutral-500'>
            Aún no hay platos disponibles
          </div>
        ) : (
          <div className='space-y-12 md:space-y-16'>
            {categories.map((category) => {
              const items = activeItems.filter((i) => i.category === category);
              return (
                <section key={category} className='space-y-6'>
                  <h2
                    className='text-white font-bold text-xl md:text-2xl uppercase tracking-wider'
                    style={{fontFamily: 'var(--font-elegant)'}}
                  >
                    {category}
                  </h2>
                  <div className='grid grid-cols-2 gap-3 md:gap-5'>
                    {items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        variant='darkCompact'
                        onClick={(i) => openDetail(i, category)}
                        isSaved={isSaved(item.id)}
                        onToggleSave={() => toggleSaved(item.id)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {selectedItem && selectedCategory && (
        <DishDetailView
          item={selectedItem}
          categoryTitle={selectedCategory}
          onClose={closeDetail}
          isSaved={isSaved(selectedItem.id)}
          onToggleSave={() => toggleSaved(selectedItem.id)}
        />
      )}
    </div>
  );
};

export default PublicMenuView;
