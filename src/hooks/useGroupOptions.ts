import {useState, useEffect, useCallback} from 'react';
import storageService from '../services/storage';
import {
  STORAGE_KEYS,
  COMENSALES_OPTIONS,
  GROUP_SHARING_OPTIONS,
  type SharingOption,
} from '../constants';

export type GroupOptionsByComensales = Record<number, SharingOption[]>;

function normalizeStored(
  raw: unknown,
): GroupOptionsByComensales {
  if (!raw || typeof raw !== 'object') {
    return {} as GroupOptionsByComensales;
  }
  const out: GroupOptionsByComensales = {} as GroupOptionsByComensales;
  for (const n of COMENSALES_OPTIONS) {
    const key = String(n);
    const arr = (raw as Record<string, unknown>)[key];
    if (Array.isArray(arr)) {
      out[n] = arr.filter(
        (x): x is SharingOption =>
          x != null &&
          typeof x === 'object' &&
          typeof (x as SharingOption).id === 'string' &&
          typeof (x as SharingOption).name === 'string',
      );
    } else {
      out[n] = [];
    }
  }
  return out;
}

function generateOptionId(comensales: number): string {
  return `group-${comensales}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface UseGroupOptionsResult {
  optionsByComensales: GroupOptionsByComensales;
  getOptions: (comensales: number) => SharingOption[];
  addOption: (
    comensales: number,
    option: {
      name: string;
      description?: string;
      price?: number;
      menuItemIds?: number[];
    },
  ) => SharingOption;
  updateOption: (
    comensales: number,
    id: string,
    updates: Partial<Pick<SharingOption, 'name' | 'description' | 'price' | 'menuItemIds'>>,
  ) => void;
  deleteOption: (comensales: number, id: string) => void;
}

export function useGroupOptions(): UseGroupOptionsResult {
  const [optionsByComensales, setOptionsByComensales] =
    useState<GroupOptionsByComensales>(() => {
      const raw = storageService.get<Record<string, SharingOption[]>>(
        STORAGE_KEYS.GROUP_OPTIONS,
      );
      if (raw && Object.keys(raw).length > 0) {
        return normalizeStored(raw);
      }
      return GROUP_SHARING_OPTIONS as unknown as GroupOptionsByComensales;
    });

  useEffect(() => {
    const toStore: Record<string, SharingOption[]> = {};
    for (const n of COMENSALES_OPTIONS) {
      toStore[String(n)] = optionsByComensales[n] ?? [];
    }
    storageService.set(STORAGE_KEYS.GROUP_OPTIONS, toStore);
  }, [optionsByComensales]);

  const getOptions = useCallback(
    (comensales: number): SharingOption[] => {
      return optionsByComensales[comensales] ?? [];
    },
    [optionsByComensales],
  );

  const addOption = useCallback(
    (
      comensales: number,
      option: {
        name: string;
        description?: string;
        price?: number;
        menuItemIds?: number[];
      },
    ): SharingOption => {
      const newOption: SharingOption = {
        id: generateOptionId(comensales),
        name: option.name.trim(),
        description: option.description?.trim() || undefined,
        price: option.price,
        menuItemIds: option.menuItemIds?.length ? option.menuItemIds : undefined,
      };
      setOptionsByComensales((prev) => ({
        ...prev,
        [comensales]: [...(prev[comensales] ?? []), newOption],
      }));
      return newOption;
    },
    [],
  );

  const updateOption = useCallback(
    (
      comensales: number,
      id: string,
      updates: Partial<Pick<SharingOption, 'name' | 'description' | 'price' | 'menuItemIds'>>,
    ) => {
      setOptionsByComensales((prev) => {
        const list = prev[comensales] ?? [];
        const idx = list.findIndex((o) => o.id === id);
        if (idx === -1) return prev;
        const next = [...list];
        next[idx] = { ...next[idx], ...updates };
        return { ...prev, [comensales]: next };
      });
    },
    [],
  );

  const deleteOption = useCallback((comensales: number, id: string) => {
    setOptionsByComensales((prev) => ({
      ...prev,
      [comensales]: (prev[comensales] ?? []).filter((o) => o.id !== id),
    }));
  }, []);

  return {
    optionsByComensales,
    getOptions,
    addOption,
    updateOption,
    deleteOption,
  };
}
