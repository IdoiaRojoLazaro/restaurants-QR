import {useState, useEffect, useRef} from 'react';
import MenuItemCard from './MenuItemCard';
import DishDetailView from './DishDetailView';
import PublicHeader from './PublicHeader';
import {useSelection} from '../../hooks/useSelection';
import type {MenuItem} from '../../constants';

interface PublicMenuViewProps {
  menuItems: MenuItem[];
  /** Categoría que se está mostrando (vista lista de platos) */
  selectedCategory: string;
  onBackToCategories: () => void;
  onOpenFilters?: () => void;
  onGoToFavorites?: () => void;
  filterActive?: boolean;
  /** Alérgenos seleccionados en el filtro: platos que los contengan se muestran deshabilitados */
  selectedAllergenIds?: string[];
  /** Si viene de un enlace compartido (?plato=id), abrir este plato al montar */
  initialItemId?: number;
}

function itemContainsSelectedAllergens(
  item: MenuItem,
  selectedAllergenIds: string[],
): boolean {
  if (!selectedAllergenIds.length || !item.allergens?.length) return false;
  return item.allergens.some((a) => selectedAllergenIds.includes(a));
}

const PublicMenuView = ({
  menuItems,
  selectedCategory,
  onBackToCategories,
  onOpenFilters,
  onGoToFavorites,
  filterActive = false,
  selectedAllergenIds = [],
  initialItemId,
}: PublicMenuViewProps) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const hasAppliedInitialId = useRef(false);

  const {isSaved, toggleSaved} = useSelection();
  const items = menuItems.filter((i) => i.category === selectedCategory);

  useEffect(() => {
    if (
      initialItemId != null &&
      items.length > 0 &&
      !hasAppliedInitialId.current
    ) {
      const item = items.find((i) => i.id === initialItemId);
      if (item) {
        hasAppliedInitialId.current = true;
        setSelectedItem(item);
      }
    }
  }, [initialItemId, items]);

  const openDetail = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  const handleGoToFavorites = () => {
    closeDetail();
    onGoToFavorites?.();
  };

  return (
    <div className='min-h-screen w-full bg-white flex flex-col'>
      <PublicHeader
        onBack={onBackToCategories}
        onOpenFilters={onOpenFilters}
        onGoToFavorites={onGoToFavorites}
        filterActive={filterActive}
        title={selectedCategory}
      />
      <div className='max-w-4xl mx-auto px-4 py-6 md:py-10 flex-1'>
        <p className='text-neutral-500 text-xs md:text-sm tracking-widest uppercase mb-6' style={{fontFamily: 'var(--font-elegant)'}}>
          Toca un plato para ver el detalle
        </p>

        {items.length === 0 ? (
          <div className='text-center py-20 text-neutral-500'>
            No hay platos en esta categoría
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-3 md:gap-5'>
            {items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                variant='darkCompact'
                onClick={(i) => openDetail(i)}
                isSaved={isSaved(item.id)}
                onToggleSave={() => toggleSaved(item.id)}
                disabled={itemContainsSelectedAllergens(item, selectedAllergenIds)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <DishDetailView
          item={selectedItem}
          categoryTitle={selectedCategory}
          onClose={closeDetail}
          isSaved={isSaved(selectedItem.id)}
          onToggleSave={() => toggleSaved(selectedItem.id)}
          onOpenFilters={onOpenFilters}
          onGoToFavorites={onGoToFavorites ? handleGoToFavorites : undefined}
          filterActive={filterActive}
        />
      )}
    </div>
  );
};

export default PublicMenuView;
