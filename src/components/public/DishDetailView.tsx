import {ChevronLeft, Filter, UtensilsCrossed, Bookmark} from 'lucide-react';
import {formatPrice} from '../../utils/helpers';
import {AllergenIcons} from '../common/AllergenIcons';
import type {MenuItem} from '../../constants';

interface DishDetailViewProps {
  item: MenuItem;
  categoryTitle: string;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

/**
 * Vista de detalle del plato: imagen a pantalla completa con overlay oscuro
 * en la parte inferior (nombre, precio, descripción, Saber más).
 */
export default function DishDetailView({
  item,
  categoryTitle,
  onClose,
  isSaved = false,
  onToggleSave,
}: DishDetailViewProps) {
  const description = item.description?.trim() || item.category;

  return (
    <div className='fixed inset-0 bg-black z-50 flex flex-col overflow-hidden'>
      {/* Header: atrás, título categoría, iconos */}
      <header className='flex items-center justify-between h-14 px-4 bg-black/95 shrink-0 z-10'>
        <button
          type='button'
          onClick={onClose}
          className='p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors'
          aria-label='Volver'
        >
          <ChevronLeft className='w-6 h-6' />
        </button>
        <h2 className='text-white font-semibold text-base uppercase tracking-wide'>
          {categoryTitle}
        </h2>
        <div className='flex items-center gap-1'>
          <button
            type='button'
            className='p-2 text-white hover:bg-white/10 rounded-full transition-colors'
            aria-label='Filtros'
          >
            <Filter className='w-5 h-5' />
          </button>
          <button
            type='button'
            className='p-2 text-white hover:bg-white/10 rounded-full transition-colors'
            aria-label='Menú'
          >
            <UtensilsCrossed className='w-5 h-5' />
          </button>
        </div>
      </header>

      {/* Imagen grande + overlay inferior */}
      <div className='relative flex-1 min-h-0 flex flex-col'>
        <div className='absolute inset-0'>
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className='w-full h-full object-cover object-center'
            />
          ) : (
            <div className='w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-500 text-6xl'>
              —
            </div>
          )}
        </div>

        {/* Overlay oscuro en la parte inferior */}
        <div
          className='absolute bottom-0 left-0 right-0 pt-24 pb-6 px-4 md:px-6'
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
          }}
        >
          <h1 className='text-white font-bold text-2xl md:text-3xl tracking-tight'>
            {item.name}
          </h1>
          <p className='text-white/90 font-medium text-lg md:text-xl mt-1'>
            {formatPrice(item.price)}
          </p>
          {item.allergens?.length ? (
            <AllergenIcons
              allergenIds={item.allergens}
              size='md'
              variant='badges'
              className='mt-2 [&_span]:bg-white/20 [&_span]:text-white'
            />
          ) : null}
          <p
            className='text-white/80 text-[18px] md:text-xl mt-3 leading-relaxed max-w-2xl'
            style={{fontFamily: 'var(--font-elegant)'}}
          >
            {description}
          </p>
          <button
            type='button'
            className='mt-4 text-[#f0e447] font-semibold text-sm uppercase tracking-wider hover:underline focus:outline-none'
          >
            Saber más
          </button>
          {onToggleSave && (
            <button
              type='button'
              onClick={() => onToggleSave()}
              className='absolute bottom-6 right-4 md:right-6 p-2 text-white hover:bg-white/10 rounded-full transition-colors'
              aria-label={
                isSaved ? 'Quitar de mi selección' : 'Guardar en mi selección'
              }
            >
              <Bookmark
                className='w-6 h-6'
                strokeWidth={2}
                fill={isSaved ? '#f0e447' : 'transparent'}
                color={isSaved ? '#f0e447' : undefined}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
