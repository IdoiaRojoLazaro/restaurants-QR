import {useState, useEffect} from 'react';
import storageService from '../services/storage';
import {
  STORAGE_KEYS,
  DEFAULT_CATEGORY_NAMES,
  type Category,
} from '../constants';
import {generateId} from '../utils/helpers';

export interface UseCategoriesResult {
  categories: Category[];
  addCategory: (name: string) => {
    success: boolean;
    error?: string;
    category?: Category;
  };
  updateCategory: (
    id: number,
    name: string,
  ) => {success: boolean; error?: string};
  deleteCategory: (id: number) => {success: boolean; error?: string};
  getCategoryById: (id: number) => Category | null;
}

function loadCategories(): Category[] {
  const stored = storageService.get<Category[]>(STORAGE_KEYS.CATEGORIES);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  return DEFAULT_CATEGORY_NAMES.map((name, index) => ({
    id: generateId() + index,
    name,
  }));
}

/**
 * Hook para gestionar categorías del menú (almacenadas en localStorage).
 */
export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>(loadCategories);

  useEffect(() => {
    storageService.set(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return {
        success: false,
        error: 'El nombre de la categoría es obligatorio',
      };
    }
    if (
      categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())
    ) {
      return {success: false, error: 'Ya existe una categoría con ese nombre'};
    }
    const newCategory: Category = {id: generateId(), name: trimmed};
    setCategories((prev) => [...prev, newCategory]);
    return {success: true, category: newCategory};
  };

  const updateCategory = (id: number, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return {
        success: false,
        error: 'El nombre de la categoría es obligatorio',
      };
    }
    const existing = categories.find((c) => c.id === id);
    if (!existing) return {success: false, error: 'Categoría no encontrada'};
    if (
      existing.name !== trimmed &&
      categories.some(
        (c) => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return {success: false, error: 'Ya existe una categoría con ese nombre'};
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? {...c, name: trimmed} : c)),
    );
    return {success: true};
  };

  const deleteCategory = (id: number) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return {success: false, error: 'Categoría no encontrada'};
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return {success: true};
  };

  const getCategoryById = (id: number) =>
    categories.find((c) => c.id === id) ?? null;

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
}
