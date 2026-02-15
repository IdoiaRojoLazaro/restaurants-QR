import {QrCode, Eye} from 'lucide-react';
import Button from './common/Button';

interface QRViewProps {
  onPreviewMenu: () => void;
}

/**
 * QRView Component
 * QR code display and information
 */
const QRView = ({onPreviewMenu}: QRViewProps) => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md'>
        <QrCode className='w-24 h-24 mx-auto mb-6 text-primary-600' />
        <h2 className='text-3xl font-bold mb-4'>Escanea para ver el menú</h2>
        <p className='text-gray-600 mb-8'>
          En una implementación real, este sería un código QR que enlaza a tu
          página de menú público
        </p>
        <div className='bg-gray-100 p-8 rounded-lg mb-6'>
          <div className='text-xs text-gray-500 mb-2'>La URL sería:</div>
          <code className='text-sm font-mono bg-white px-3 py-2 rounded block'>
            tuapp.com/menu/nombre-restaurante
          </code>
        </div>
        <Button
          variant='primary'
          icon={Eye}
          onClick={onPreviewMenu}
          className='mx-auto'
        >
          Ver menú público
        </Button>
      </div>
    </div>
  );
};

export default QRView;
