import {Bookmark} from 'lucide-react';
import {formatPrice} from '../../utils/helpers';
import {AllergenIcons} from '../common/AllergenIcons';
import type {MenuItem} from '../../constants';

interface MenuItemCardProps {
  item: MenuItem;
  onClick?: (item: MenuItem) => void;
  variant?: 'default' | 'dark' | 'darkCompact';
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent) => void;
}

/**
 * Tarjeta para lista de menú: imagen cuadrada, título y precio (estilo carta digital).
 */
const MenuItemCard = ({
  item,
  onClick,
  variant = 'darkCompact',
  isSaved = false,
  onToggleSave,
}: MenuItemCardProps) => {
  const isClickable = Boolean(onClick);

  if (variant === 'darkCompact') {
    return (
      <article
        role={isClickable ? 'button' : undefined}
        onClick={isClickable ? () => onClick?.(item) : undefined}
        className={`
          group relative flex flex-col overflow-hidden rounded-xl border-2 border-neutral-800
          transition-colors duration-200
          ${isClickable ? 'cursor-pointer hover:border-[#f0e447]' : ''}
        `}
      >
        <div className='aspect-square w-full overflow-hidden bg-neutral-900'>
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-neutral-500 text-3xl'>
              —
            </div>
          )}
        </div>
        {onToggleSave && (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(e);
            }}
            className='absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10'
            aria-label={
              isSaved ? 'Quitar de mi selección' : 'Guardar en mi selección'
            }
          >
            <Bookmark
              className='w-5 h-5'
              strokeWidth={2}
              fill={isSaved ? '#f0e447' : 'transparent'}
              color={isSaved ? '#f0e447' : undefined}
            />
          </button>
        )}
        <div className='p-3 md:p-4 flex flex-col gap-1'>
          <h3 className='text-white font-bold text-sm md:text-base uppercase tracking-wide line-clamp-2'>
            {item.name}
          </h3>
          {item.allergens?.length ? (
            <AllergenIcons
              allergenIds={item.allergens}
              size='sm'
              variant='badges'
              className='[&_span]:bg-neutral-700 [&_span]:text-white'
            />
          ) : null}
          <p className='text-[#f0e447] font-semibold text-base md:text-lg'>
            {formatPrice(item.price)}
          </p>
        </div>
      </article>
    );
  }

  if (variant === 'dark') {
    return (
      <article
        role={isClickable ? 'button' : undefined}
        onClick={isClickable ? () => onClick?.(item) : undefined}
        className={`
          group flex flex-col items-center text-center
          ${isClickable ? 'cursor-pointer' : ''}
        `}
      >
        <div className='relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-neutral-700 flex-shrink-0'>
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-4xl'>
              —
            </div>
          )}
        </div>
        <h3 className='w-full text-center text-white font-semibold text-sm uppercase tracking-widest my-1'>
          {item.name}
        </h3>
        {item.allergens?.length ? (
          <div className='flex justify-center my-1'>
            <AllergenIcons
              allergenIds={item.allergens}
              size='sm'
              variant='badges'
            />
          </div>
        ) : null}
        <p
          className='text-neutral-400 text-sm leading-relaxed max-w-xs'
          style={{fontFamily: 'var(--font-elegant)'}}
        >
          {item.description?.trim() ? item.description : item.category}
        </p>
        <p
          className='mt-3 text-white font-medium text-lg tracking-wide'
          style={{fontFamily: 'var(--font-elegant)'}}
        >
          {formatPrice(item.price)}
        </p>
      </article>
    );
  }

  // Fallback default (light)
  return (
    <article
      role={isClickable ? 'button' : undefined}
      onClick={isClickable ? () => onClick?.(item) : undefined}
      className={`rounded-xl border border-gray-200 overflow-hidden bg-white ${
        isClickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className='w-full h-48 object-cover'
        />
      )}
      <div className='p-4'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='text-lg font-semibold text-gray-900'>{item.name}</h3>
          <span className='text-lg font-bold text-primary-600'>
            {formatPrice(item.price)}
          </span>
        </div>
        {item.allergens?.length ? (
          <AllergenIcons
            allergenIds={item.allergens}
            size='sm'
            variant='badges'
            className='mb-2'
          />
        ) : null}
        {item.description?.trim() && (
          <p className='text-sm text-gray-600 mb-2'>{item.description}</p>
        )}
      </div>
    </article>
  );
};

export default MenuItemCard;
