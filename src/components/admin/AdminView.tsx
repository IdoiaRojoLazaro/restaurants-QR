import {useState, useMemo} from 'react';
import {Plus, UtensilsCrossed, FolderOpen} from 'lucide-react';
import MenuItemForm from './MenuItemForm';
import MenuItemsTable from './MenuItemsTable';
import CategoryForm from './CategoryForm';
import CategoriesTable from './CategoriesTable';
import {Button, Modal} from '../common';
import {useCategories} from '../../hooks/useCategories';
import type {MenuItem, Category} from '../../constants';
import type {MenuItemFormData} from '../../utils/helpers';

const ADMIN_TAB = {PLATOS: 'platos', CATEGORIAS: 'categorias'} as const;

interface AdminViewProps {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItemFormData) => {
    success: boolean;
    error?: string;
    item?: MenuItem;
  };
  onUpdateItem: (
    id: number,
    updates: MenuItemFormData,
  ) => {success: boolean; error?: string};
  onDeleteItem: (id: number) => {success: boolean};
  onToggleActive: (id: number, active: boolean) => void;
  onUpdateMenuItemsCategory: (oldName: string, newName: string) => void;
}

/**
 * AdminView Component
 * Main admin interface for managing menu items
 */
const AdminView = ({
  menuItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleActive,
  onUpdateMenuItemsCategory,
}: AdminViewProps) => {
  const [adminTab, setAdminTab] = useState<string>(ADMIN_TAB.PLATOS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {categories, addCategory, updateCategory, deleteCategory} =
    useCategories();

  const countByCategory = useMemo(() => {
    const count: Record<string, number> = {};
    menuItems.forEach((item) => {
      count[item.category] = (count[item.category] ?? 0) + 1;
    });
    return count;
  }, [menuItems]);

  const handleAddSubmit = (formData: MenuItemFormData) => {
    const result = onAddItem(formData);
    if (result.success) {
      setShowAddForm(false);
    }
  };

  const handleEditSubmit = (formData: MenuItemFormData) => {
    if (!editingItem) return;
    const result = onUpdateItem(editingItem.id, formData);
    if (result.success) {
      setEditingItem(null);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Seguro que quieres eliminar este plato?')) {
      onDeleteItem(id);
    }
  };

  const handleAddCategorySubmit = (name: string) => {
    const result = addCategory(name);
    if (result.success) setShowAddCategory(false);
    else if (result.error) window.alert(result.error);
  };

  const handleEditCategorySubmit = (name: string) => {
    if (!editingCategory) return;
    const result = updateCategory(editingCategory.id, name);
    if (result.success) {
      onUpdateMenuItemsCategory(editingCategory.name, name);
      setEditingCategory(null);
    } else if (result.error) window.alert(result.error);
  };

  const handleDeleteCategory = (category: Category) => {
    const count = countByCategory[category.name] ?? 0;
    if (count > 0) {
      window.alert(
        `No se puede eliminar "${category.name}": hay ${count} plato(s) con esta categoría. Cambia primero la categoría de esos platos.`,
      );
      return;
    }
    if (window.confirm(`¿Eliminar la categoría "${category.name}"?`)) {
      deleteCategory(category.id);
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='flex flex-wrap justify-between items-center gap-4 mb-6'>
        <h1 className='text-3xl font-bold'>Administración</h1>
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={() => setAdminTab(ADMIN_TAB.PLATOS)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              adminTab === ADMIN_TAB.PLATOS
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <UtensilsCrossed className='w-4 h-4' />
            Platos
          </button>
          <button
            type='button'
            onClick={() => setAdminTab(ADMIN_TAB.CATEGORIAS)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              adminTab === ADMIN_TAB.CATEGORIAS
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FolderOpen className='w-4 h-4' />
            Categorías
          </button>
        </div>
      </div>

      {adminTab === ADMIN_TAB.PLATOS && (
        <>
          <div className='flex flex-wrap justify-between items-center gap-4 mb-4'>
            <h2 className='text-xl font-semibold'>Menú</h2>
            <Button
              variant='primary'
              icon={Plus}
              onClick={() => setShowAddForm(true)}
            >
              Añadir plato
            </Button>
          </div>

          <Modal
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            title='Añadir plato nuevo'
            size='lg'
          >
            <MenuItemForm
              categories={categories}
              onSubmit={handleAddSubmit}
              onCancel={() => setShowAddForm(false)}
              embedded
            />
          </Modal>

          <Modal
            isOpen={!!editingItem}
            onClose={() => setEditingItem(null)}
            title='Editar plato'
            size='lg'
          >
            {editingItem && (
              <MenuItemForm
                item={editingItem}
                categories={categories}
                onSubmit={handleEditSubmit}
                onCancel={() => setEditingItem(null)}
                embedded
              />
            )}
          </Modal>

          <MenuItemsTable
            menuItems={menuItems}
            onEdit={setEditingItem}
            onDelete={handleDelete}
            onToggleActive={onToggleActive}
          />
        </>
      )}

      {adminTab === ADMIN_TAB.CATEGORIAS && (
        <>
          <div className='flex flex-wrap justify-between items-center gap-4 mb-4'>
            <h2 className='text-xl font-semibold'>Categorías</h2>
            <Button
              variant='primary'
              icon={Plus}
              onClick={() => setShowAddCategory(true)}
            >
              Añadir categoría
            </Button>
          </div>

          <Modal
            isOpen={showAddCategory}
            onClose={() => setShowAddCategory(false)}
            title='Añadir categoría'
            size='md'
          >
            <CategoryForm
              onSubmit={handleAddCategorySubmit}
              onCancel={() => setShowAddCategory(false)}
              embedded
            />
          </Modal>

          <Modal
            isOpen={!!editingCategory}
            onClose={() => setEditingCategory(null)}
            title='Editar categoría'
            size='md'
          >
            {editingCategory && (
              <CategoryForm
                initialName={editingCategory.name}
                onSubmit={handleEditCategorySubmit}
                onCancel={() => setEditingCategory(null)}
                embedded
              />
            )}
          </Modal>

          <CategoriesTable
            categories={categories}
            onEdit={setEditingCategory}
            onDelete={handleDeleteCategory}
            countByCategory={countByCategory}
          />
        </>
      )}
    </div>
  );
};

export default AdminView;
