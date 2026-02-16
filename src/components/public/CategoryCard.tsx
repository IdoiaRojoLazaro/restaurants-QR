interface CategoryCardProps {
  title: string;
  imageUrl?: string;
  onClick: () => void;
}

export default function CategoryCard({
  title,
  imageUrl,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='w-full relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow min-h-[140px] flex items-center justify-center text-left'
    >
      {/* Imagen de fondo (plato de la categoría) */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=''
          className='absolute inset-0 w-full h-full object-cover'
        />
      ) : (
        <div className='absolute inset-0 bg-neutral-300' />
      )}
      {/* Velo oscuro para legibilidad del texto */}
      <div className='absolute inset-0 bg-black/50' aria-hidden />
      {/* Título: letra fina, mayúsculas, blanco */}
      <span
        className='text-center relative z-10 text-white font-light text-xl md:text-2xl tracking-widest uppercase px-6 py-4'
        style={{fontFamily: 'var(--font-elegant)'}}
      >
        {title}
      </span>
    </button>
  );
}
