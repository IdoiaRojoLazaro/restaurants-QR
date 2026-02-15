import {useState} from 'react';
import Navigation from './components/Navigation';
import AdminView from './components/admin/AdminView';
import PublicMenuView from './components/public/PublicMenuView';
import MySelectionView from './components/public/MySelectionView';
import QRView from './components/QRView';
import {useMenuItems} from './hooks/useMenuItems';
import {VIEWS} from './constants';

/**
 * Layout con navegación (Admin, menú público, analytics, QR)
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
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
          <p className='text-gray-600'>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen flex flex-col bg-gray-50 overflow-hidden'>
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main
        className={`flex-1 min-h-0 overflow-auto flex flex-col ${
          currentView === VIEWS.PUBLIC ? 'bg-black' : ''
        }`}
      >
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
        {currentView === VIEWS.PUBLIC && (
          <PublicMenuView menuItems={menuItems} />
        )}
        {currentView === VIEWS.QR && (
          <QRView onPreviewMenu={() => setCurrentView(VIEWS.PUBLIC)} />
        )}
        {currentView === VIEWS.MY_SELECTION && (
          <MySelectionView
            menuItems={menuItems}
            onBack={() => setCurrentView(VIEWS.PUBLIC)}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  return <MainLayout />;
}

export default App;
