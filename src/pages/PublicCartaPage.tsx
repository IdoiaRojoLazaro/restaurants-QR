import PublicMenuWrapper from '../components/public/PublicMenuWrapper';
import {useMenuItems} from '../hooks/useMenuItems';

/**
 * Página pública de la carta digital (ruta /).
 * Sin header ni navegación; para abrir en otra pestaña.
 */
export default function PublicCartaPage() {
  const {menuItems, loading} = useMenuItems();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Cargando carta...</p>
        </div>
      </div>
    );
  }

  return <PublicMenuWrapper menuItems={menuItems} />;
}
