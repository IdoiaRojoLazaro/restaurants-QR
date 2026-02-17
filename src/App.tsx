import {useState} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Navigation from './components/Navigation';
import AdminView from './components/admin/AdminView';
import MySelectionView from './components/public/MySelectionView';
import QRView from './components/QRView';
import PublicCartaPage from './pages/PublicCartaPage';
import {useMenuItems} from './hooks/useMenuItems';
import {VIEWS, ROUTES} from './constants';

/**
 * Layout con navegación (Admin, QR, Mi selección). Carta digital abre en otra pestaña.
 */
function MainLayout() {
  const [currentView, setCurrentView] = useState<string>(VIEWS.ADMIN);
  const {
    menuItems,
    loading: menuLoading,
    addMenuItem,
    updateMenuItem,
    setMenuItemActive,
    updateMenuItemsCategory,
    deleteMenuItem,
  } = useMenuItems();
  const loading = menuLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 min-h-0 overflow-auto flex flex-col">
        {currentView === VIEWS.ADMIN && (
          <AdminView
            menuItems={menuItems}
            onAddItem={addMenuItem}
            onUpdateItem={updateMenuItem}
            onDeleteItem={deleteMenuItem}
            onToggleActive={setMenuItemActive}
            onUpdateMenuItemsCategory={updateMenuItemsCategory}
          />
        )}
        {currentView === VIEWS.QR && (
          <QRView
            onPreviewMenu={() => window.open(ROUTES.PUBLIC, '_blank', 'noopener,noreferrer')}
          />
        )}
        {currentView === VIEWS.MY_SELECTION && (
          <MySelectionView
            menuItems={menuItems}
            onBack={() => setCurrentView(VIEWS.ADMIN)}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.PUBLIC} replace />} />
      <Route path={ROUTES.PUBLIC} element={<PublicCartaPage />} />
      <Route path={ROUTES.ADMIN} element={<MainLayout />} />
    </Routes>
  );
}

export default App;
