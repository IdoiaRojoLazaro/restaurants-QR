import React from 'react';
import CategoryCard from './CategoryCard';

/**
 * Devuelve la URL de imagen del primer plato de la categoría que tenga imagen.
 */
function getImageForCategory(menuItems, categoryName) {
  const item = menuItems.find((i) => i.category === categoryName && i.image);
  return item?.image;
}

export default function CategoriesView({
  categories,
  menuItems = [],
  onSelectCategory,
}) {
  if (!categories?.length) {
    return (
      <main className='min-h-screen bg-white flex flex-col items-center justify-center px-4'>
        <h1
          className='text-4xl mb-8 text-neutral-800 font-semibold'
          style={{fontFamily: 'var(--font-elegant)'}}
        >
          Carta Digital
        </h1>
        <p className='text-neutral-500'>Aún no hay categorías disponibles.</p>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-white flex flex-col px-4 py-8'>
      <h1
        className='text-2xl md:text-3xl text-neutral-800 font-semibold mb-1 text-center'
        style={{fontFamily: 'var(--font-elegant)'}}
      >
        Menú
      </h1>
      <p className='mb-6 text-neutral-500 text-sm text-center'>
        Elige una categoría y explora nuestra carta.
      </p>
      <section className='flex flex-col gap-4 max-w-2xl mx-auto w-full'>
        {categories.map((categoryName) => (
          <CategoryCard
            key={categoryName}
            title={categoryName}
            imageUrl={getImageForCategory(menuItems, categoryName)}
            onClick={() => onSelectCategory(categoryName)}
          />
        ))}
      </section>
    </main>
  );
}
