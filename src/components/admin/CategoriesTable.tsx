import {Edit2, Trash2} from 'lucide-react';
import {Button} from '../common';
import type {Category} from '../../constants';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  /** Número de platos por categoría (nombre -> count) para avisar al eliminar */
  countByCategory?: Record<string, number>;
}

/**
 * Lista de categorías con acciones Editar y Eliminar.
 */
export default function CategoriesTable({
  categories,
  onEdit,
  onDelete,
  countByCategory = {},
}: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className='text-center py-12 text-gray-500'>
        Aún no hay categorías. ¡Haz clic en &quot;Añadir categoría&quot; para
        empezar!
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Nombre
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Platos
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {categories.map((cat) => {
              const count = countByCategory[cat.name] ?? 0;
              return (
                <tr key={cat.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 font-medium text-gray-900'>
                    {cat.name}
                  </td>
                  <td className='px-6 py-4 text-gray-600'>{count}</td>
                  <td className='px-6 py-4'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onEdit(cat)}
                        icon={Edit2}
                        className='!p-2 text-primary-600 hover:bg-primary-50'
                        title='Editar'
                      >
                        <span className='sr-only'>Editar</span>
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onDelete(cat)}
                        icon={Trash2}
                        className='!p-2 text-primary-600 hover:bg-primary-50'
                        title='Eliminar'
                      >
                        <span className='sr-only'>Eliminar</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
