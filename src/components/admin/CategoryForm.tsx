import {useState, useEffect} from 'react';
import {Input, Button} from '../common';

interface CategoryFormProps {
  /** Si se pasa, modo edición */
  initialName?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  /** Cuando true, solo formulario (sin Card); usar dentro de Modal */
  embedded?: boolean;
}

/**
 * Formulario para añadir o editar una categoría (solo nombre).
 */
export default function CategoryForm({
  initialName = '',
  onSubmit,
  onCancel,
  embedded = false,
}: CategoryFormProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }
    setError('');
    onSubmit(trimmed);
  };

  const form = (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        label='Nombre de la categoría'
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError('');
        }}
        placeholder='ej. Entrantes, Pizza, Postres'
        required
        error={error}
      />
      <div className='flex gap-2'>
        <Button type='submit' variant='primary'>
          {initialName ? 'Guardar' : 'Añadir'} categoría
        </Button>
        <Button type='button' variant='secondary' onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );

  if (embedded) return form;
  return <div className='p-4'>{form}</div>;
}
