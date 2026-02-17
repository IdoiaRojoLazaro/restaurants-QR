import {useState, useRef} from 'react';
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

const PublicMenuWrapper = ({menuItems}: PublicMenuWrapperProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showIntroVideo, setShowIntroVideo] = useState(true);
  const [showFavoritesView, setShowFavoritesView] = useState(false);
  const [showGroupOption, setShowGroupOption] = useState(false);
  const [showAllergenFilter, setShowAllergenFilter] = useState(false);
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeItems = menuItems.filter((item) => item.active !== false);
  const categories = getUniqueCategories(activeItems);

  const closeIntroVideo = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    markIntroVideoSeen();
    setShowIntroVideo(false);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Vídeo de bienvenida (solo la primera vez) */}
      {showIntroVideo && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <video
            key={MENU_INTRO_VIDEO_URL}
            src={MENU_INTRO_VIDEO_URL}
            className="w-full h-full object-contain"
            autoPlay
            muted
            playsInline
            preload="auto"
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
            type="button"
            onClick={closeIntroVideo}
            className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors"
          >
            Saltar
          </button>
        </div>
      )}

      {showFavoritesView ? (
        <div className="min-h-screen h-screen flex flex-col">
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
        />
      )}

      <GroupOptionModal
        isOpen={showGroupOption}
        onClose={() => setShowGroupOption(false)}
      />

      <AllergenFilterModal
        isOpen={showAllergenFilter}
        onClose={() => setShowAllergenFilter(false)}
        selectedAllergenIds={selectedAllergenIds}
        onSelectionChange={setSelectedAllergenIds}
      />
    </div>
  );
};

export default PublicMenuWrapper;
