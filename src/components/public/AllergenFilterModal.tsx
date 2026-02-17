import {X} from 'lucide-react';
import {ALLERGENS, ALLERGEN_ICON_MAP} from '../common/AllergenIcons';

const fontElegant = {fontFamily: 'var(--font-elegant)'};

interface AllergenFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAllergenIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

/**
 * Modal para seleccionar alérgenos a filtrar: los platos que contengan
 * alguno de los seleccionados se mostrarán como deshabilitados.
 */
export default function AllergenFilterModal({
  isOpen,
  onClose,
  selectedAllergenIds,
  onSelectionChange,
}: AllergenFilterModalProps) {
  if (!isOpen) return null;

  const toggle = (id: string) => {
    const next = selectedAllergenIds.includes(id)
      ? selectedAllergenIds.filter((x) => x !== id)
      : [...selectedAllergenIds, id];
    onSelectionChange(next);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Filtrar por alérgenos"
    >
      <header
        className="flex items-center justify-between h-14 px-4 border-b border-neutral-200 shrink-0"
        style={fontElegant}
      >
        <h2 className="text-neutral-800 font-light text-base uppercase tracking-[0.15em]">
          Filtrar por alérgenos
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="text-neutral-500 text-sm mb-6" style={fontElegant}>
          Marca los alérgenos que quieres evitar. Los platos que los contengan
          aparecerán deshabilitados.
        </p>
        <div className="flex flex-wrap gap-2">
          {ALLERGENS.map((a) => {
            const Icon = ALLERGEN_ICON_MAP[a.id];
            const checked = selectedAllergenIds.includes(a.id);
            return (
              <label
                key={a.id}
                className={`
                  inline-flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer
                  transition-colors
                  ${
                    checked
                      ? 'border-primary-500 bg-primary-50 text-primary-800'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(a.id)}
                  className="sr-only"
                />
                {Icon && (
                  <Icon
                    size={20}
                    className={checked ? 'text-primary-600' : 'text-neutral-500'}
                  />
                )}
                <span className="text-sm font-medium">{a.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
