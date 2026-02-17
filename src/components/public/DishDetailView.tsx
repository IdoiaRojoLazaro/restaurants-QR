import {useState} from 'react';
import {Bookmark, ChevronDown, Share2} from 'lucide-react';
import PublicHeader from './PublicHeader';
import {formatPrice, getWhatsAppShareUrl} from '../../utils/helpers';
import {AllergenIcons} from '../common/AllergenIcons';
import type {MenuItem} from '../../constants';

interface DishDetailViewProps {
  item: MenuItem;
  categoryTitle: string;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onOpenFilters?: () => void;
  onGoToFavorites?: () => void;
  filterActive?: boolean;
}

const fontElegant = {fontFamily: 'var(--font-elegant)'};

/**
 * Vista de detalle del plato: imagen a pantalla completa con overlay oscuro
 * en la parte inferior (nombre, precio, descripción desplegable, Saber más).
 */
export default function DishDetailView({
  item,
  categoryTitle,
  onClose,
  isSaved = false,
  onToggleSave,
  onOpenFilters,
  onGoToFavorites,
  filterActive = false,
}: DishDetailViewProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const description = item.description?.trim() || item.category;

  const handleShareWhatsApp = () => {
    const url = getWhatsAppShareUrl(item, categoryTitle);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='fixed inset-0 bg-black z-50 flex flex-col overflow-hidden'>
      <PublicHeader
        onBack={onClose}
        onOpenFilters={onOpenFilters}
        onGoToFavorites={onGoToFavorites}
        filterActive={filterActive}
        fixed
        isDetailsView={true}
      />

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
          <h1
            className='text-white font-light text-2xl md:text-3xl tracking-tight'
            style={fontElegant}
          >
            {item.name}
          </h1>
          <p
            className='text-white/90 font-normal text-lg md:text-xl mt-1 tracking-wide'
            style={fontElegant}
          >
            {formatPrice(item.price)}
          </p>

          {/* Descripción, alérgenos y sugerencias desplegables con animación */}
          <div
            className='grid transition-[grid-template-rows] duration-300 ease-out'
            style={{gridTemplateRows: descriptionExpanded ? '1fr' : '0fr'}}
          >
            <div className='overflow-hidden'>
              <p
                className='text-white/80 text-[17px] md:text-lg mt-3 leading-relaxed max-w-2xl'
                style={fontElegant}
              >
                {description}
              </p>
              {item.allergens && item.allergens.length > 0 && (
                <div className='mt-3'>
                  <AllergenIcons
                    allergenIds={item.allergens}
                    size='md'
                    variant='badges'
                    className='[&_span]:bg-white/20 [&_span]:text-white'
                  />
                </div>
              )}
              {item.suggestions && item.suggestions.length > 0 && (
                <div className='mt-4 pt-4 border-t border-white/20'>
                  <p
                    className='text-white/60 text-xs uppercase tracking-[0.2em] mb-2'
                    style={fontElegant}
                  >
                    Sugerencias
                  </p>
                  <p
                    className='text-white/75 text-[15px] md:text-base leading-relaxed'
                    style={fontElegant}
                  >
                    {item.suggestions.join(' · ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type='button'
            onClick={() => setDescriptionExpanded((v) => !v)}
            className='mt-3 flex items-center gap-1.5 text-white/90 border border-white/40 hover:border-white/70 hover:text-white rounded-full px-4 py-2 text-sm font-light tracking-wide transition-colors duration-200'
            style={fontElegant}
          >
            {descriptionExpanded ? 'Ver menos' : 'Saber más'}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${descriptionExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          <div className='absolute bottom-6 right-4 md:right-6 flex items-center gap-1'>
            <button
              type='button'
              onClick={handleShareWhatsApp}
              className='p-2 text-white hover:bg-white/10 rounded-full transition-colors'
              aria-label='Compartir por WhatsApp'
            >
              <Share2 className='w-6 h-6' />
            </button>
            {onToggleSave && (
              <button
                type='button'
                onClick={() => onToggleSave()}
                className='p-2 text-white hover:bg-white/10 rounded-full transition-colors'
                aria-label={
                  isSaved ? 'Quitar de mi selección' : 'Guardar en mi selección'
                }
              >
                <Bookmark
                  className='w-6 h-6'
                  strokeWidth={2}
                  fill={isSaved ? '#fcaa2d' : 'transparent'}
                  color={isSaved ? '#fcaa2d' : undefined}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
