import {useState, useCallback, useEffect} from 'react';
import storageService from '../services/storage';
import {STORAGE_KEYS} from '../constants';

const MAX_QUANTITY = 99;

/** Selection: dish id -> quantity (1 to MAX_QUANTITY) */
export type SelectionMap = Record<number, number>;

function loadSelection(): SelectionMap {
  const stored = storageService.get<Record<string, number> | number[]>(
    STORAGE_KEYS.SELECTION,
    {},
  );
  if (Array.isArray(stored)) {
    const map: SelectionMap = {};
    for (const id of stored) {
      if (Number.isInteger(id)) map[id] = 1;
    }
    return map;
  }
  if (!stored || typeof stored !== 'object') return {};
  const map: SelectionMap = {};
  for (const key of Object.keys(stored)) {
    const id = Number(key);
    const qty = Number(stored[key]);
    if (Number.isInteger(id) && qty >= 1 && qty <= MAX_QUANTITY) map[id] = qty;
  }
  return map;
}

export interface UseSelectionResult {
  /** Ids currently in selection (for isSaved / list) */
  savedIds: number[];
  /** Quantity for a dish (1 to MAX), or 0 if not in selection */
  getQuantity: (id: number) => number;
  isSaved: (id: number) => boolean;
  toggleSaved: (id: number) => void;
  /** Set quantity (1–99); 0 removes from selection */
  setQuantity: (id: number, quantity: number) => void;
  /** Add or subtract one; removes item if quantity would go to 0 */
  adjustQuantity: (id: number, delta: 1 | -1) => void;
  removeFromSelection: (id: number) => void;
  /** Full map id -> quantity for totals */
  selection: SelectionMap;
}

/**
 * Hook para guardar selección de platos con cantidad variable por plato.
 */
export function useSelection(): UseSelectionResult {
  const [selection, setSelection] = useState<SelectionMap>(loadSelection);

  useEffect(() => {
    storageService.set(STORAGE_KEYS.SELECTION, selection);
  }, [selection]);

  const savedIds = Object.keys(selection).map(Number);

  const getQuantity = useCallback(
    (id: number) => selection[id] ?? 0,
    [selection],
  );

  const isSaved = useCallback((id: number) => id in selection, [selection]);

  const toggleSaved = useCallback((id: number) => {
    setSelection((prev) =>
      id in prev
        ? (() => {
            const next = {...prev};
            delete next[id];
            return next;
          })()
        : {...prev, [id]: 1},
    );
  }, []);

  const setQuantity = useCallback((id: number, quantity: number) => {
    if (quantity < 1) {
      setSelection((prev) => {
        const next = {...prev};
        delete next[id];
        return next;
      });
      return;
    }
    const qty = Math.min(quantity, MAX_QUANTITY);
    setSelection((prev) => ({...prev, [id]: qty}));
  }, []);

  const adjustQuantity = useCallback((id: number, delta: 1 | -1) => {
    setSelection((prev) => {
      const current = prev[id] ?? 0;
      const nextQty = current + delta;
      if (nextQty < 1) {
        const next = {...prev};
        delete next[id];
        return next;
      }
      return {...prev, [id]: Math.min(nextQty, MAX_QUANTITY)};
    });
  }, []);

  const removeFromSelection = useCallback((id: number) => {
    setSelection((prev) => {
      const next = {...prev};
      delete next[id];
      return next;
    });
  }, []);

  return {
    savedIds,
    getQuantity,
    isSaved,
    toggleSaved,
    setQuantity,
    adjustQuantity,
    removeFromSelection,
    selection,
  };
}
