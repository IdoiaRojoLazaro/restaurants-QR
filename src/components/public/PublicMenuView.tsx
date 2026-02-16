import {useState} from 'react';
import MenuItemCard from './MenuItemCard';
import DishDetailView from './DishDetailView';
import {useSelection} from '../../hooks/useSelection';
import type {MenuItem} from '../../constants';

interface PublicMenuViewProps {
  menuItems: MenuItem[];
  /** Categoría que se está mostrando (vista lista de platos) */
  selectedCategory: string;
  onBackToCategories: () => void;
}

const PublicMenuView = ({
  menuItems,
  selectedCategory,
  onBackToCategories,
}: PublicMenuViewProps) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const {isSaved, toggleSaved} = useSelection();
  const items = menuItems.filter((i) => i.category === selectedCategory);

  const openDetail = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  return (
    <div className='min-h-screen w-full bg-white'>
      <div className='max-w-4xl mx-auto px-4 py-6 md:py-10'>
        <header className='mb-6 md:mb-8'>
          <button
            type='button'
            onClick={onBackToCategories}
            className='flex items-center gap-2 text-neutral-600 hover:text-neutral-900 text-sm mb-4 transition-colors'
          >
            <span aria-hidden>←</span>
            Volver a categorías
          </button>
          <h1
            className='text-3xl md:text-4xl font-semibold tracking-wide text-neutral-800 mb-2'
            style={{fontFamily: 'var(--font-elegant)'}}
          >
            {selectedCategory}
          </h1>
          <p className='text-neutral-500 text-xs md:text-sm tracking-widest uppercase'>
            Toca un plato para ver el detalle
          </p>
        </header>

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
        />
      )}
    </div>
  );
};

export default PublicMenuView;
