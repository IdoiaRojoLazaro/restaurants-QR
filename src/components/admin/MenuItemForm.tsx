import {useState, useEffect} from 'react';
import {Input, Button, Card} from '../common';
import {ALLERGENS, ALLERGEN_ICON_MAP} from '../common/AllergenIcons';
import type {MenuItem, Category} from '../../constants';
import type {MenuItemFormData} from '../../utils/helpers';

interface MenuItemFormProps {
  item?: MenuItem | null;
  /** Si se pasa, la categoría se elige de un desplegable en lugar de texto libre */
  categories?: Category[];
  onSubmit: (formData: MenuItemFormData) => void;
  onCancel: () => void;
  /** When true, render only the form (no Card/title); use inside Modal */
  embedded?: boolean;
}

/**
 * MenuItemForm Component
 * Form for creating or editing menu items
 */
const MenuItemForm = ({
  item,
  categories = [],
  onSubmit,
  onCancel,
  embedded = false,
}: MenuItemFormProps) => {
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: '',
    category: '',
    price: '',
    image: '',
    description: '',
    allergens: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        price: item.price ?? '',
        image: item.image || '',
        description: item.description || '',
        allergens: item.allergens ?? [],
      });
    }
  }, [item]);

  const handleChange =
    (field: keyof MenuItemFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      if (errors[field]) {
        setErrors((prev) => ({...prev, [field]: ''}));
      }
    };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!String(formData.name).trim()) {
      newErrors.name = 'El nombre del plato es obligatorio';
    }

    if (!String(formData.category).trim()) {
      newErrors.category = 'La categoría es obligatoria';
    }

    if (
      formData.price === undefined ||
      formData.price === '' ||
      parseFloat(String(formData.price)) <= 0
    ) {
      newErrors.price = 'Introduce un precio válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        label='Nombre del plato'
        value={formData.name}
        onChange={handleChange('name')}
        placeholder='ej. Pizza margarita'
        required
        error={errors.name}
      />

      {categories.length > 0 ? (
        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Categoría <span className='text-red-500'>*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => {
              setFormData((prev) => ({...prev, category: e.target.value}));
              if (errors.category)
                setErrors((prev) => ({...prev, category: ''}));
            }}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none'
          >
            <option value=''>Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className='mt-1 text-sm text-red-600'>{errors.category}</p>
          )}
        </div>
      ) : (
        <Input
          label='Categoría'
          value={formData.category}
          onChange={handleChange('category')}
          placeholder='ej. Pizza, Pasta, Ensaladas'
          required
          error={errors.category}
        />
      )}

      <Input
        label='Precio (€)'
        type='number'
        step='0.01'
        value={formData.price}
        onChange={handleChange('price')}
        placeholder='0,00'
        required
        error={errors.price}
      />

      <Input
        label='URL de la imagen'
        type='url'
        value={formData.image}
        onChange={handleChange('image')}
        placeholder='https://ejemplo.com/imagen.jpg'
        error={errors.image}
      />

      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Descripción
        </label>
        <textarea
          value={formData.description ?? ''}
          onChange={handleChange('description')}
          placeholder='ej. Tomate, mozzarella y albahaca.'
          rows={3}
          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none'
        />
      </div>

      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Alérgenos
        </label>
        <div className='flex flex-wrap gap-2'>
          {ALLERGENS.map((a) => {
            const Icon = ALLERGEN_ICON_MAP[a.id];
            const checked = (formData.allergens ?? []).includes(a.id);
            return (
              <label
                key={a.id}
                className={`
                    inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border cursor-pointer
                    transition-colors
                    ${
                      checked
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                    }
                  `}
              >
                <input
                  type='checkbox'
                  checked={checked}
                  onChange={() => {
                    const prev = formData.allergens ?? [];
                    const next = prev.includes(a.id)
                      ? prev.filter((x) => x !== a.id)
                      : [...prev, a.id];
                    setFormData((f) => ({...f, allergens: next}));
                  }}
                  className='sr-only'
                />
                {Icon && <Icon size={18} className='text-gray-600 shrink-0' />}
                <span className='text-sm font-medium text-gray-700'>
                  {a.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className='flex gap-2'>
        <Button type='submit' variant='primary'>
          {item ? 'Guardar' : 'Añadir'} plato
        </Button>
        <Button type='button' variant='secondary' onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <Card className='p-6 mb-4'>
      <h3 className='text-lg font-semibold mb-4'>
        {item ? 'Editar plato' : 'Añadir plato nuevo'}
      </h3>
      {formContent}
    </Card>
  );
};

export default MenuItemForm;
