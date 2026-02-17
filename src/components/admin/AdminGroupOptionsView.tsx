import {useState, useMemo} from 'react';
import {
  ChevronLeft,
  Users,
  Plus,
  Pencil,
  Trash2,
  Check,
} from 'lucide-react';
import {formatPrice} from '../../utils/helpers';
import {groupByCategory} from '../../utils/helpers';
import {useGroupOptions} from '../../hooks/useGroupOptions';
import {COMENSALES_OPTIONS, type SharingOption, type MenuItem} from '../../constants';
import {Button, Modal} from '../common';

const fontElegant = {fontFamily: 'var(--font-elegant)'};

interface AdminGroupOptionsViewProps {
  menuItems: MenuItem[];
}

type FormState = {
  name: string;
  description: string;
  price: string;
  menuItemIds: number[];
};

const emptyForm: FormState = {
  name: '',
  description: '',
  price: '',
  menuItemIds: [],
};

/**
 * Vista admin: crear y editar opciones para grupos (menús para 2, 4, 6, 8 personas).
 * Paso 1: elegir número de comensales. Paso 2: listar opciones y formulario para añadir/editar.
 */
export default function AdminGroupOptionsView({
  menuItems,
}: AdminGroupOptionsViewProps) {
  const [selectedComensales, setSelectedComensales] = useState<number | null>(
    null,
  );
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingOption, setEditingOption] = useState<SharingOption | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {getOptions, addOption, updateOption, deleteOption} = useGroupOptions();
  const options = selectedComensales
    ? getOptions(selectedComensales)
    : [];

  const menuByCategory = useMemo(
    () => groupByCategory(menuItems),
    [menuItems],
  );
  const categoryNames = Object.keys(menuByCategory).sort();

  const openNewForm = () => {
    setEditingOption(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (opt: SharingOption) => {
    setEditingOption(opt);
    setForm({
      name: opt.name,
      description: opt.description ?? '',
      price: opt.price != null ? String(opt.price) : '',
      menuItemIds: opt.menuItemIds ?? [],
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingOption(null);
    setForm(emptyForm);
  };

  const toggleDish = (id: number) => {
    setForm((prev) =>
      prev.menuItemIds.includes(id)
        ? { ...prev, menuItemIds: prev.menuItemIds.filter((x) => x !== id) }
        : { ...prev, menuItemIds: [...prev.menuItemIds, id] },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComensales || !form.name.trim()) return;
    const price = form.price.trim() ? parseFloat(form.price.replace(',', '.')) : undefined;
    if (editingOption) {
      updateOption(selectedComensales, editingOption.id, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Number.isFinite(price) ? price : undefined,
        menuItemIds: form.menuItemIds.length ? form.menuItemIds : undefined,
      });
    } else {
      addOption(selectedComensales, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Number.isFinite(price) ? price : undefined,
        menuItemIds: form.menuItemIds.length ? form.menuItemIds : undefined,
      });
    }
    closeForm();
  };

  const handleDelete = (opt: SharingOption) => {
    if (!selectedComensales) return;
    if (window.confirm(`¿Eliminar la opción "${opt.name}"?`)) {
      deleteOption(selectedComensales, opt.id);
    }
  };

  // Paso 1: elegir número de comensales
  if (selectedComensales === null) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Opciones para grupos
        </h2>
        <p className="text-gray-600 mb-8">
          Elige para cuántas personas quieres definir menús (luego podrás crear
          varias opciones por número).
        </p>
        <div className="grid grid-cols-2 gap-4">
          {COMENSALES_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSelectedComensales(n)}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 py-8 px-4 transition-colors"
            >
              <Users className="w-10 h-10 text-gray-500" />
              <span className="text-lg font-medium text-gray-800" style={fontElegant}>
                {n} personas
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Paso 2: listar opciones y formulario
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => setSelectedComensales(null)}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Volver a elegir comensales"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-gray-800" style={fontElegant}>
            Opciones para {selectedComensales} personas
          </h2>
          <p className="text-sm text-gray-500">
            Crea varias opciones (menús) que los clientes podrán elegir al
            compartir entre {selectedComensales}.
          </p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Button variant="primary" icon={Plus} onClick={openNewForm}>
          Nueva opción
        </Button>
      </div>

      {options.length === 0 && !showForm ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center text-gray-500">
          <p className="mb-4">Aún no hay opciones para {selectedComensales} personas.</p>
          <Button variant="primary" icon={Plus} onClick={openNewForm}>
            Crear primera opción
          </Button>
        </div>
      ) : (
        <ul className="space-y-4 mb-8">
          {options.map((opt) => (
            <li
              key={opt.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800" style={fontElegant}>
                  {opt.name}
                </h3>
                {opt.description && (
                  <p className="text-sm text-gray-600 mt-1">{opt.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                  {opt.price != null && (
                    <span className="font-medium text-primary-600">
                      {formatPrice(opt.price)}
                    </span>
                  )}
                  {opt.menuItemIds && opt.menuItemIds.length > 0 && (
                    <span>
                      {opt.menuItemIds.length} plato
                      {opt.menuItemIds.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditForm(opt)}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  aria-label="Editar"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(opt)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editingOption ? 'Editar opción' : 'Nueva opción'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ej. Menú para dos"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={2}
              placeholder="Breve descripción para la carta"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio total (opcional, €)
            </label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ej. 38"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platos incluidos (marca los que forman esta opción)
            </label>
            <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 p-3 space-y-3">
              {categoryNames.map((cat) => (
                <div key={cat}>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    {cat}
                  </p>
                  <ul className="space-y-1.5">
                    {(menuByCategory[cat] ?? []).map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={form.menuItemIds.includes(item.id)}
                          onClick={() => toggleDish(item.id)}
                          className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded hover:bg-gray-100"
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                              form.menuItemIds.includes(item.id)
                                ? 'bg-primary-600 border-primary-600 text-white'
                                : 'border-gray-300'
                            }`}
                          >
                            {form.menuItemIds.includes(item.id) ? (
                              <Check className="w-3 h-3" />
                            ) : null}
                          </span>
                          <span className="text-sm text-gray-800 truncate">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-500 ml-auto shrink-0">
                            {formatPrice(item.price)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {menuItems.length === 0 && (
                <p className="text-sm text-gray-500">
                  Añade primero platos en la pestaña Platos.
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={closeForm}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {editingOption ? 'Guardar cambios' : 'Guardar opción'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
