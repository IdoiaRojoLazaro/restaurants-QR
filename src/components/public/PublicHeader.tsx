import {ChevronLeft, Filter, Bookmark} from 'lucide-react';

const fontElegant = {fontFamily: 'var(--font-elegant)'};

interface PublicHeaderProps {
  onBack?: () => void;
  onOpenFilters?: () => void;
  onGoToFavorites?: () => void;
  title?: string;
  /** Si true, el icono de filtros se muestra como activo (alérgenos seleccionados) */
  filterActive?: boolean;
  /** Si true, el header es fijo sobre contenido (ej. detalle a pantalla completa) */
  fixed?: boolean;
  isDetailsView?: boolean;
}

/**
 * Header blanco reutilizable para vistas públicas: atrás (opcional), título (opcional), filtros y favoritos.
 */
export default function PublicHeader({
  onBack,
  onOpenFilters,
  onGoToFavorites,
  title,
  filterActive = false,
  fixed = false,
  isDetailsView = false,
}: PublicHeaderProps) {
  const baseClass = 'flex items-center justify-between h-14 px-4 shrink-0 z-10';
  const className = fixed
    ? `fixed top-0 left-0 right-0 ${baseClass}`
    : baseClass;
  const isDetailsViewClass = isDetailsView
    ? 'bg-transparent border-b-0 border-none'
    : 'bg-white border-b border-neutral-200';

  const backBtnClass = isDetailsView
    ? 'p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors shrink-0'
    : 'text-neutral-600 hover:text-neutral-900 p-2 -ml-2 rounded-full transition-colors shrink-0';

  const filterBtnClass = isDetailsView
    ? `p-2 rounded-full transition-colors ${filterActive ? 'text-white bg-white/20 hover:bg-white/30' : 'text-white hover:bg-white/10'}`
    : `p-2 rounded-full transition-colors ${filterActive ? 'text-primary-600 bg-primary-50 hover:bg-primary-100' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'}`;

  const favoritesBtnClass = isDetailsView
    ? 'p-2 text-white hover:bg-white/10 rounded-full transition-colors'
    : 'p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors';

  const iconSize = isDetailsView ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <header
      className={`${className} ${isDetailsViewClass}`}
      style={fontElegant}
    >
      <div className='flex items-center min-w-0 flex-1'>
        {onBack ? (
          <button
            type='button'
            onClick={onBack}
            className={backBtnClass}
            aria-label='Volver'
          >
            <ChevronLeft className={iconSize} />
          </button>
        ) : (
          <div className='w-10 shrink-0' aria-hidden />
        )}
        {title ? (
          <h1
            className={`flex-1 text-center font-light text-base uppercase tracking-[0.15em] truncate mx-2 ${isDetailsView ? 'text-white' : 'text-neutral-800'}`}
          >
            {title}
          </h1>
        ) : (
          <div className='flex-1' aria-hidden />
        )}
      </div>
      <div className='flex items-center gap-1 shrink-0'>
        {onOpenFilters && (
          <button
            type='button'
            onClick={onOpenFilters}
            className={filterBtnClass}
            aria-label={filterActive ? 'Filtros activos' : 'Filtros'}
          >
            <Filter
              className={iconSize}
              strokeWidth={2}
              fill={filterActive ? 'currentColor' : 'transparent'}
            />
          </button>
        )}
        {onGoToFavorites && (
          <button
            type='button'
            onClick={onGoToFavorites}
            className={favoritesBtnClass}
            aria-label='Ir a favoritos'
          >
            <Bookmark className={iconSize} strokeWidth={2} />
          </button>
        )}
      </div>
    </header>
  );
}
