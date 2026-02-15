import {Home, QrCode, Eye, Bookmark} from 'lucide-react';
import {VIEWS} from '../constants';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

/**
 * Navigation Component
 * Top navigation bar for switching between views
 */
const Navigation = ({currentView, onViewChange}: NavigationProps) => {
  const navItems = [
    {id: VIEWS.ADMIN, label: 'Menú', icon: Home},
    {id: VIEWS.QR, label: 'Código QR', icon: QrCode},
    {id: VIEWS.PUBLIC, label: 'Carta Digital', icon: Eye},
    {id: VIEWS.MY_SELECTION, label: 'Mi selección', icon: Bookmark},
  ];

  return (
    <nav className='bg-white shadow-sm border-b sticky top-0 z-40'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <a
            href='#'
            className='flex items-center gap-2 shrink-0'
            aria-label='BocaBoca home'
          >
            <img
              src='https://www.guiabocaboca.com/wp-content/uploads/2024/07/logo-BocaBoca-1-1-300x154.png'
              alt='BocaBoca'
              className='h-10 w-auto object-contain'
            />
          </a>

          {/* Navigation Items */}
          <div className='flex gap-2'>
            {navItems.map(({id, label, icon: Icon}) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  currentView === id
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <Icon className='w-4 h-4' />
                <span className='hidden sm:inline'>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
