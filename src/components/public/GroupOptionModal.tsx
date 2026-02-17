import {useState} from 'react';
import {ChevronLeft, Users, X} from 'lucide-react';
import {formatPrice} from '../../utils/helpers';
import {COMENSALES_OPTIONS} from '../../constants';
import {useGroupOptions} from '../../hooks/useGroupOptions';

const fontElegant = {fontFamily: 'var(--font-elegant)'};

interface GroupOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Popup en dos pasos: (1) seleccionar número de comensales, (2) ver opciones para compartir.
 * Las opciones se gestionan desde el admin (Opciones grupos).
 */
export default function GroupOptionModal({
  isOpen,
  onClose,
}: GroupOptionModalProps) {
  const [comensales, setComensales] = useState<number | null>(null);
  const {getOptions} = useGroupOptions();

  const options = comensales ? getOptions(comensales) : [];

  const handleSelectComensales = (n: number) => {
    setComensales(n);
  };

  const handleBack = () => {
    setComensales(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Opción de grupos"
    >
      {/* Header fijo */}
      <header
        className="flex items-center justify-between h-14 px-4 border-b border-neutral-200 shrink-0"
        style={fontElegant}
      >
        <div className="flex items-center gap-2">
          {comensales !== null ? (
            <button
              type="button"
              onClick={handleBack}
              className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Volver a elegir comensales"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-10" aria-hidden />
          )}
          <h2 className="text-neutral-800 font-light text-base uppercase tracking-[0.15em]">
            {comensales === null
              ? 'Opción de grupos'
              : `Para compartir entre ${comensales}`}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        {comensales === null ? (
          /* Paso 1: elegir número de comensales */
          <div className="max-w-2xl mx-auto px-4 py-8">
            <p
              className="text-neutral-600 text-center mb-8 text-lg"
              style={fontElegant}
            >
              ¿Cuántos sois?
            </p>
            <div className="grid grid-cols-2 gap-4">
              {COMENSALES_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleSelectComensales(n)}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 py-8 px-4 transition-colors"
                >
                  <Users className="w-10 h-10 text-neutral-500" />
                  <span
                    className="text-2xl font-light text-neutral-800"
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
          <div className="max-w-2xl mx-auto px-4 py-6">
            {options.length === 0 ? (
              <p
                className="text-neutral-500 text-center py-12"
                style={fontElegant}
              >
                No hay opciones definidas para {comensales} personas.
              </p>
            ) : (
              <ul className="flex flex-col gap-4">
                {options.map((opt) => (
                  <li key={opt.id}>
                    <article
                      className="block w-full rounded-xl border border-neutral-200 overflow-hidden text-left hover:border-neutral-300 hover:shadow-md transition-all"
                      style={fontElegant}
                    >
                      <div className="p-5">
                        <h3 className="text-lg font-medium text-neutral-800 tracking-tight">
                          {opt.name}
                        </h3>
                        {opt.description && (
                          <p className="text-neutral-600 text-sm mt-2 leading-relaxed">
                            {opt.description}
                          </p>
                        )}
                        {opt.price !== undefined && (
                          <p className="text-neutral-800 font-medium mt-3">
                            {formatPrice(opt.price)}
                          </p>
                        )}
                        <p className="text-neutral-400 text-xs mt-2 uppercase tracking-wider">
                          Para {comensales} personas
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
