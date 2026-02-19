import {Trash2, ChefHat, Minus, Plus, Share2} from 'lucide-react';
import {formatPrice} from '../../utils/helpers';
import {useSelection} from '../../hooks/useSelection';
import PublicHeader from './PublicHeader';
import type {MenuItem} from '../../constants';

const fontElegant = {fontFamily: 'var(--font-elegant)'};

interface MySelectionViewProps {
  menuItems: MenuItem[];
  onBack: () => void;
}

/**
 * Vista "Mi selección": platos guardados con selector de cantidad por plato.
 * Misma estética que el resto de vistas públicas: fondo blanco y tipografía elegante.
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

  const shareViaWhatsApp = () => {
    const lines = selectedItems.map(
      (item) => `${getQuantity(item.id)}x ${item.name}`,
    );
    const text = `Mi selección\n\n${lines.join('\n')}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      <PublicHeader onBack={onBack} title='Mi selección' />

      {/* Lista de platos con selector de cantidad */}
      <div className='flex-1 overflow-y-auto px-4 py-6'>
        {selectedItems.length === 0 ? (
          <div
            className='text-center py-16 text-neutral-500'
            style={fontElegant}
          >
            <p className='text-xl mb-2 text-neutral-700'>
              Aún no has guardado ningún plato
            </p>
            <p className='text-sm font-light'>
              Toca el icono de guardar en el menú o en el detalle de un plato
              para añadirlo aquí
            </p>
          </div>
        ) : (
          <ul className='space-y-4 max-w-2xl mx-auto'>
            {selectedItems.map((item) => {
              const qty = getQuantity(item.id);
              const subtotal = item.price * qty;
              return (
                <li
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${
                    item.active === false
                      ? 'bg-neutral-50 border-neutral-200 opacity-75'
                      : 'bg-white border-neutral-200 shadow-sm'
                  }`}
                >
                  <div className='w-16 h-16 rounded-full overflow-hidden bg-neutral-100 shrink-0'>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div
                        className='w-full h-full flex items-center justify-center text-neutral-400 text-xl'
                        style={fontElegant}
                      >
                        —
                      </div>
                    )}
                  </div>
                  <div className='flex flex-col min-w-0 flex-1 gap-2'>
                    <div className='min-w-0' style={fontElegant}>
                      <div className='flex items-center gap-2 min-w-0'>
                        <h2 className='text-neutral-800 font-medium text-lg truncate min-w-0'>
                          {item.name}
                        </h2>
                        {item.active === false && (
                          <span className='shrink-0 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded'>
                            No disponible
                          </span>
                        )}
                      </div>
                      <p className='text-primary-600 font-medium text-sm mt-0.5'>
                        {formatPrice(item.price)} × {qty} ={' '}
                        {formatPrice(subtotal)}
                      </p>
                    </div>
                    {/* Selector: papelera, menos, cantidad, más */}
                    <div className='flex items-center gap-2 shrink-0'>
                      <button
                        type='button'
                        onClick={() => removeFromSelection(item.id)}
                        className='p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors'
                        aria-label='Quitar de mi selección'
                      >
                        <Trash2 className='w-5 h-5' />
                      </button>
                      <button
                        type='button'
                        onClick={() => adjustQuantity(item.id, -1)}
                        className='w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors'
                        aria-label='Restar uno'
                      >
                        <Minus className='w-4 h-4' />
                      </button>
                      <span
                        className='w-8 text-center text-neutral-800 font-semibold tabular-nums'
                        style={fontElegant}
                        aria-live='polite'
                      >
                        {qty}
                      </span>
                      <button
                        type='button'
                        onClick={() => adjustQuantity(item.id, 1)}
                        className='w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors'
                        aria-label='Añadir uno'
                      >
                        <Plus className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer: total platos pedidos + total dinero */}
      {selectedItems.length > 0 && (
        <footer
          className='shrink-0 px-4 py-5 bg-neutral-50 border-t border-neutral-200'
          style={fontElegant}
        >
          <div className='flex flex-col gap-4 max-w-2xl mx-auto'>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-2'>
                <div className='flex items-center gap-2'>
                  <ChefHat className='w-5 h-5 text-primary-600 shrink-0' />
                  <span className='text-neutral-800 font-semibold tabular-nums'>
                    {totalUnits} {totalUnits === 1 ? 'plato' : 'platos'}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-neutral-500 text-sm font-light'>
                    Total
                  </span>
                  <p className='text-primary-600 font-bold text-2xl tabular-nums'>
                    {formatPrice(totalMoney)}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={shareViaWhatsApp}
                  className='p-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors'
                  aria-label='Compartir por WhatsApp'
                >
                  <Share2 className='w-5 h-5 shrink-0' />
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
