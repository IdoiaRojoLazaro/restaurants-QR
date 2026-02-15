import {useEffect} from 'react';
import {X} from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Modal Component
 * Reusable modal dialog
 */
const Modal = ({isOpen, onClose, title, children, size = 'md'}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className='fixed inset-0 bg-gray-600/50 flex items-center justify-center p-4 z-50'
      onClick={onClose}
      role='presentation'
    >
      <div
        className={`bg-white rounded-lg ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b'>
          <h3 className='text-2xl font-bold'>{title}</h3>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            icon={X}
            className='!p-1'
            title='Cerrar'
          >
            <span className='sr-only'>Cerrar</span>
          </Button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto flex-1'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
