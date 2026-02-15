import {useState, useMemo} from 'react';
import {
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {Button} from '../common';
import {AllergenIcons} from '../common/AllergenIcons';
import {formatPrice} from '../../utils/helpers';
import type {MenuItem} from '../../constants';

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50] as const;

type SortBy = 'name' | 'price';
type SortOrder = 'asc' | 'desc';

interface MenuItemsTableProps {
  menuItems: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, active: boolean) => void;
}

/**
 * MenuItemsTable Component
 * Table view for managing menu items with sorting and pagination
 */
const MenuItemsTable = ({
  menuItems,
  onEdit,
  onDelete,
  onToggleActive,
}: MenuItemsTableProps) => {
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const sortedItems = useMemo(() => {
    const copy = [...menuItems];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') {
        cmp = a.name.localeCompare(b.name, 'es');
      } else {
        cmp = a.price - b.price;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [menuItems, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));
  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageEnd = Math.min(pageStart + itemsPerPage, sortedItems.length);
  const paginatedItems = sortedItems.slice(pageStart, pageEnd);

  const handleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const SortIcon = ({field}: {field: SortBy}) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className='w-4 h-4 inline-block ml-0.5' />
    ) : (
      <ChevronDown className='w-4 h-4 inline-block ml-0.5' />
    );
  };

  if (menuItems.length === 0) {
    return (
      <div className='text-center py-12 text-gray-500'>
        Aún no hay platos. ¡Haz clic en &quot;Añadir plato&quot; para empezar!
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 tracking-wider'>
                <button
                  type='button'
                  onClick={() => handleSort('name')}
                  className='cursor-pointer text-left text-xs font-medium flex items-center hover:text-gray-700 text-gray-500 uppercase'
                >
                  Plato
                  <SortIcon field='name' />
                </button>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Categoría
              </th>
              <th className='px-6 py-3 tracking-wider'>
                <button
                  type='button'
                  onClick={() => handleSort('price')}
                  className='cursor-pointer text-left text-xs font-medium flex items-center hover:text-gray-700 text-gray-500 uppercase'
                >
                  Precio
                  <SortIcon field='price' />
                </button>
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Alérgenos
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Activo
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {paginatedItems.map((item) => (
              <tr key={item.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-12 h-12 rounded object-cover'
                      />
                    )}
                    <span className='font-medium'>{item.name}</span>
                  </div>
                </td>
                <td className='px-6 py-4 text-gray-600'>{item.category}</td>
                <td className='px-6 py-4 text-gray-600'>
                  {formatPrice(item.price)}
                </td>
                <td className='px-6 py-4'>
                  {item.allergens?.length ? (
                    <AllergenIcons
                      allergenIds={item.allergens}
                      size='sm'
                      variant='inline'
                    />
                  ) : (
                    <span className='text-gray-400 text-sm'>—</span>
                  )}
                </td>
                <td className='px-6 py-4'>
                  <button
                    type='button'
                    role='switch'
                    aria-checked={item.active !== false}
                    aria-label={
                      item.active !== false
                        ? 'Desactivar plato'
                        : 'Activar plato'
                    }
                    title={
                      item.active !== false
                        ? 'Desactivar (ocultar en menú público)'
                        : 'Activar (mostrar en menú público)'
                    }
                    onClick={() =>
                      onToggleActive(item.id, item.active === false)
                    }
                    className={`
                      relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
                      transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      ${
                        item.active !== false ? 'bg-primary-600' : 'bg-gray-200'
                      }
                    `}
                  >
                    <span
                      className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow
                        transition-transform
                        ${
                          item.active !== false
                            ? 'translate-x-6'
                            : 'translate-x-0.5'
                        }
                      `}
                      style={{marginTop: 2}}
                    />
                  </button>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onEdit(item)}
                      icon={Edit2}
                      className='!p-2 text-primary-600 hover:bg-primary-50'
                      title='Editar'
                    >
                      <span className='sr-only'>Editar</span>
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onDelete(item.id)}
                      icon={Trash2}
                      className='!p-2 text-primary-600 hover:bg-primary-50'
                      title='Eliminar'
                    >
                      <span className='sr-only'>Eliminar</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className='flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50'>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-gray-600'>
            Mostrando {pageStart + 1}-{pageEnd} de {sortedItems.length} platos
          </span>
          <label className='flex items-center gap-2 text-sm text-gray-600'>
            <span>Por página:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className='border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-primary-500 focus:border-primary-500'
            >
              {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            icon={ChevronLeft}
            className='!p-2'
            title='Página anterior'
          >
            <span className='sr-only'>Anterior</span>
          </Button>
          <span className='text-sm text-gray-600 min-w-[100px] text-center'>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            icon={ChevronRight}
            className='!p-2'
            title='Página siguiente'
          >
            <span className='sr-only'>Siguiente</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemsTable;
