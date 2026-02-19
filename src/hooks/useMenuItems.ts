import {useState, useEffect} from 'react';
import storageService from '../services/storage';
import {STORAGE_KEYS, DEMO_MENU_ITEMS, type MenuItem} from '../constants';
import {
  generateId,
  validateMenuItem,
  type MenuItemFormData,
} from '../utils/helpers';

export interface UseMenuItemsResult {
  menuItems: MenuItem[];
  loading: boolean;
  addMenuItem: (item: MenuItemFormData) => {
    success: boolean;
    error?: string;
    item?: MenuItem;
  };
  updateMenuItem: (
    id: number,
    updates: MenuItemFormData,
  ) => {success: boolean; error?: string};
  setMenuItemActive: (id: number, active: boolean) => void;
  updateMenuItemsCategory: (oldName: string, newName: string) => void;
  deleteMenuItem: (id: number) => {success: boolean};
  getMenuItemById: (id: number) => MenuItem | null;
}

/**
 * Custom hook for managing menu items
 */
export const useMenuItems = (): UseMenuItemsResult => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load menu items from localStorage on mount
  useEffect(() => {
    const savedItems = storageService.get<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS);

    if (savedItems && savedItems.length > 0) {
      setMenuItems(savedItems);
    } else {
      // Initialize with demo data
      setMenuItems(DEMO_MENU_ITEMS);
      storageService.set(STORAGE_KEYS.MENU_ITEMS, DEMO_MENU_ITEMS);
    }

    setLoading(false);
  }, []);

  // Save to localStorage whenever menuItems change
  useEffect(() => {
    if (!loading && menuItems.length > 0) {
      storageService.set(STORAGE_KEYS.MENU_ITEMS, menuItems);
    }
  }, [menuItems, loading]);

  const addMenuItem = (item: MenuItemFormData) => {
    const validation = validateMenuItem(item);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', '),
      };
    }

    const newItem: MenuItem = {
      ...item,
      id: generateId(),
      name: item.name,
      category: item.category,
      price: parseFloat(String(item.price)),
      image: item.image,
      videoUrl: item.videoUrl?.trim() || undefined,
      description: item.description,
      allergens: item.allergens ?? [],
      active: true,
    };

    setMenuItems((prev) => [...prev, newItem]);

    return {
      success: true,
      item: newItem,
    };
  };

  const updateMenuItem = (id: number, updates: MenuItemFormData) => {
    const updatedItem: Partial<MenuItem> = {
      name: updates.name,
      category: updates.category,
      price: parseFloat(String(updates.price)),
      image: updates.image,
      videoUrl: updates.videoUrl?.trim() || undefined,
      description: updates.description,
      allergens: updates.allergens ?? [],
    };

    const validation = validateMenuItem(updatedItem);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', '),
      };
    }

    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? {...item, ...updatedItem} : item)),
    );

    return {success: true};
  };

  const setMenuItemActive = (id: number, active: boolean) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? {...item, active} : item)),
    );
  };

  const updateMenuItemsCategory = (oldName: string, newName: string) => {
    if (oldName === newName) return;
    setMenuItems((prev) =>
      prev.map((item) =>
        item.category === oldName ? {...item, category: newName} : item,
      ),
    );
  };

  const deleteMenuItem = (id: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    return {success: true};
  };

  const getMenuItemById = (id: number) => {
    return menuItems.find((item) => item.id === id) || null;
  };

  return {
    menuItems,
    loading,
    addMenuItem,
    updateMenuItem,
    setMenuItemActive,
    updateMenuItemsCategory,
    deleteMenuItem,
    getMenuItemById,
  };
};
