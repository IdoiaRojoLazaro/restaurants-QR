import {useState} from 'react';
import {ChevronLeft, ChevronDown, Users, X} from 'lucide-react';
import {formatPrice} from '../../utils/helpers';
import {COMENSALES_OPTIONS} from '../../constants';
import {useGroupOptions} from '../../hooks/useGroupOptions';
import type {MenuItem} from '../../constants';

const fontElegant = {fontFamily: 'var(--font-elegant)'};

interface GroupOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Lista de platos del menú para mostrar nombres en cada opción */
  menuItems?: MenuItem[];
}

/**
 * Popup en dos pasos: (1) seleccionar número de comensales, (2) ver opciones para compartir.
 * Al hacer clic en una opción se muestra la lista de platos incluidos.
 */
export default function GroupOptionModal({
  isOpen,
  onClose,
  menuItems = [],
}: GroupOptionModalProps) {
  const [comensales, setComensales] = useState<number | null>(null);
  const [expandedOptionId, setExpandedOptionId] = useState<string | null>(null);
  const {getOptions} = useGroupOptions();

  const options = comensales ? getOptions(comensales) : [];

  const getItemsForOption = (menuItemIds: number[] | undefined): MenuItem[] => {
    if (!menuItemIds?.length) return [];
    const idSet = new Set(menuItemIds);
    return menuItems.filter((item) => idSet.has(item.id));
  };

  const handleSelectComensales = (n: number) => {
    setComensales(n);
    setExpandedOptionId(null);
  };

  const handleBack = () => {
    setComensales(null);
    setExpandedOptionId(null);
  };

  const handleClose = () => {
    setExpandedOptionId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex flex-col bg-white'
      role='dialog'
      aria-modal='true'
      aria-label='Opción de grupos'
    >
      {/* Header fijo */}
      <header
        className='flex items-center justify-between h-14 px-4 border-b border-neutral-200 shrink-0'
        style={fontElegant}
      >
        <div className='flex items-center gap-2'>
          {comensales !== null ? (
            <button
              type='button'
              onClick={handleBack}
              className='p-2 -ml-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors'
              aria-label='Volver a elegir comensales'
            >
              <ChevronLeft className='w-6 h-6' />
            </button>
          ) : (
            <div className='w-10' aria-hidden />
          )}
          <h2 className='text-neutral-800 font-light text-base uppercase tracking-[0.15em]'>
            {comensales === null
              ? 'Opción de grupos'
              : `Para compartir entre ${comensales}`}
          </h2>
        </div>
        <button
          type='button'
          onClick={handleClose}
          className='p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors'
          aria-label='Cerrar'
        >
          <X className='w-6 h-6' />
        </button>
      </header>

      <div className='flex-1 overflow-y-auto'>
        {comensales === null ? (
          /* Paso 1: elegir número de comensales */
          <div className='max-w-2xl mx-auto px-4 py-8'>
            <p
              className='text-neutral-600 text-center mb-8 text-lg'
              style={fontElegant}
            >
              ¿Cuántos sois?
            </p>
            <div className='grid grid-cols-2 gap-4'>
              {COMENSALES_OPTIONS.map((n) => (
                <button
                  key={n}
                  type='button'
                  onClick={() => handleSelectComensales(n)}
                  className='flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 py-8 px-4 transition-colors'
                >
                  <Users className='w-10 h-10 text-neutral-500' />
                  <span
                    className='text-2xl font-light text-neutral-800'
                    style={fontElegant}
                  >
                    {n} {(n as number) === 1 ? 'persona' : 'personas'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Paso 2: opciones para compartir entre X */
          <div className='max-w-2xl mx-auto px-4 py-6'>
            {options.length === 0 ? (
              <p
                className='text-neutral-500 text-center py-12'
                style={fontElegant}
              >
                No hay opciones definidas para {comensales} personas.
              </p>
            ) : (
              <ul className='flex flex-col gap-4'>
                {options.map((opt) => {
                  const includedItems = getItemsForOption(opt.menuItemIds);
                  const totalPrice =
                    includedItems.length > 0
                      ? includedItems.reduce((s, i) => s + i.price, 0)
                      : opt.price;
                  const isExpanded = expandedOptionId === opt.id;
                  const hasItems = includedItems.length > 0;
                  const canExpand = hasItems;

                  return (
                    <li key={opt.id}>
                      <article
                        className='block w-full rounded-xl border border-neutral-200 overflow-hidden text-left hover:border-neutral-300 hover:shadow-md transition-all'
                        style={fontElegant}
                      >
                        <button
                          type='button'
                          onClick={() =>
                            canExpand
                              ? setExpandedOptionId((id) =>
                                  id === opt.id ? null : opt.id,
                                )
                              : undefined
                          }
                          className={`w-full text-left ${canExpand ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          <div className='p-5 flex items-start justify-between gap-2'>
                            <div className='min-w-0 flex-1'>
                              <h3 className='text-lg font-medium text-neutral-800 tracking-tight'>
                                {opt.name}
                              </h3>
                              {opt.description && (
                                <p className='text-neutral-600 text-sm mt-2 leading-relaxed'>
                                  {opt.description}
                                </p>
                              )}
                              {totalPrice != null && totalPrice > 0 && (
                                <p className='text-neutral-800 font-medium mt-3'>
                                  {formatPrice(totalPrice)}
                                </p>
                              )}
                              <p className='text-neutral-400 text-xs mt-2 uppercase tracking-wider'>
                                Para {comensales} personas
                              </p>
                            </div>
                            {canExpand && (
                              <ChevronDown
                                className={`w-5 h-5 text-neutral-400 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            )}
                          </div>
                        </button>
                        {isExpanded && hasItems && (
                          <div className='border-t border-neutral-100 bg-neutral-50 px-5 py-4'>
                            <p className='text-neutral-500 text-xs uppercase tracking-wider mb-2'>
                              Platos incluidos
                            </p>
                            <ul className='space-y-1.5'>
                              {includedItems.map((item) => (
                                <li
                                  key={item.id}
                                  className='text-neutral-800 text-sm flex items-center gap-2'
                                >
                                  <span className='text-primary-600'>·</span>
                                  <span>{item.name}</span>
                                  <span className='text-neutral-500 text-xs ml-auto shrink-0'>
                                    {formatPrice(item.price)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {isExpanded && !hasItems && opt.menuItemIds?.length && (
                          <div className='border-t border-neutral-100 bg-neutral-50 px-5 py-4'>
                            <p className='text-neutral-500 text-sm'>
                              Algunos platos ya no están en el menú.
                            </p>
                          </div>
                        )}
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
