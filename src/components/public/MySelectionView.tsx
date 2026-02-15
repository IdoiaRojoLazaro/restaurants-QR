import {ChevronLeft, Trash2, ChefHat, Minus, Plus} from 'lucide-react';
import {formatPrice} from '../../utils/helpers';
import {useSelection} from '../../hooks/useSelection';
import type {MenuItem} from '../../constants';

interface MySelectionViewProps {
  menuItems: MenuItem[];
  onBack: () => void;
}

/**
 * Vista "Mi selección": platos guardados con selector de cantidad por plato.
 */
export default function MySelectionView({
  menuItems,
  onBack,
}: MySelectionViewProps) {
  const {savedIds, getQuantity, adjustQuantity, removeFromSelection} =
    useSelection();
  const selectedItems = menuItems.filter((item) => savedIds.includes(item.id));

  const totalUnits = selectedItems.reduce(
    (sum, item) => sum + getQuantity(item.id),
    0,
  );
  const totalMoney = selectedItems.reduce(
    (sum, item) => sum + item.price * getQuantity(item.id),
    0,
  );

  return (
    <div className='h-full min-h-0 bg-black text-white flex flex-col'>
      {/* Header */}
      <header className='flex items-center h-14 px-4 bg-black border-b border-neutral-800 shrink-0'>
        <button
          type='button'
          onClick={onBack}
          className='p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors'
          aria-label='Volver'
        >
          <ChevronLeft className='w-6 h-6' />
        </button>
        <h1 className='flex-1 text-center text-white font-semibold text-lg uppercase tracking-wide mr-8'>
          Mi selección
        </h1>
      </header>

      {/* Lista de platos con selector de cantidad */}
      <div className='flex-1 min-h-0 overflow-y-auto px-4 py-6'>
        {selectedItems.length === 0 ? (
          <div className='text-center py-16 text-neutral-400'>
            <p className='text-lg mb-2'>Aún no has guardado ningún plato</p>
            <p className='text-sm'>
              Toca el icono de guardar en el menú o en el detalle de un plato
              para añadirlo aquí
            </p>
          </div>
        ) : (
          <ul className='space-y-4'>
            {selectedItems.map((item) => {
              const qty = getQuantity(item.id);
              const subtotal = item.price * qty;
              return (
                <li
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${
                    item.active === false
                      ? 'bg-neutral-900/50 border-neutral-700 opacity-75'
                      : 'bg-neutral-900/80 border-neutral-800'
                  }`}
                >
                  <div className='w-16 h-16 rounded-full overflow-hidden bg-neutral-800 shrink-0'>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-neutral-500 text-xl'>
                        —
                      </div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <h2 className='text-white font-semibold text-base truncate'>
                        {item.name}
                      </h2>
                      {item.active === false && (
                        <span className='shrink-0 text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded'>
                          No disponible
                        </span>
                      )}
                    </div>
                    <p className='text-[#f0e447] font-medium text-sm mt-0.5'>
                      {formatPrice(item.price)} × {qty} ={' '}
                      {formatPrice(subtotal)}
                    </p>
                  </div>
                  {/* Selector: papelera, menos, cantidad, más */}
                  <div className='flex items-center gap-2 shrink-0'>
                    <button
                      type='button'
                      onClick={() => removeFromSelection(item.id)}
                      className='p-2 text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors'
                      aria-label='Quitar de mi selección'
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                    <button
                      type='button'
                      onClick={() => adjustQuantity(item.id, -1)}
                      className='w-9 h-9 flex items-center justify-center rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition-colors'
                      aria-label='Restar uno'
                    >
                      <Minus className='w-4 h-4' />
                    </button>
                    <span
                      className='w-8 text-center text-white font-semibold tabular-nums'
                      aria-live='polite'
                    >
                      {qty}
                    </span>
                    <button
                      type='button'
                      onClick={() => adjustQuantity(item.id, 1)}
                      className='w-9 h-9 flex items-center justify-center rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition-colors'
                      aria-label='Añadir uno'
                    >
                      <Plus className='w-4 h-4' />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer: total platos pedidos + total dinero en una línea */}
      {selectedItems.length > 0 && (
        <footer className='shrink-0 px-4 py-5 bg-neutral-900/90 border-t border-neutral-800'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <ChefHat className='w-5 h-5 text-[#f0e447] shrink-0' />
              <span className='text-white font-semibold tabular-nums'>
                {totalUnits} {totalUnits === 1 ? 'plato' : 'platos'}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-neutral-400 text-sm'>Total</span>
              <p className='text-[#f0e447] font-bold text-2xl tabular-nums'>
                {formatPrice(totalMoney)}
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
