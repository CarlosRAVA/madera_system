import { cx } from '@/shared/utils';
import type { Category } from '@/shared/types';

interface CategoryTabsProps {
  categories: Category[];
  activeId: number | null;
  onChange: (id: number | null) => void;
}

export function CategoryTabs({
  categories,
  activeId,
  onChange,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onChange(null)}
        className={cx(
          'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border',
          activeId === null
            ? 'bg-primary text-white border-primary'
            : 'bg-transparent text-beige/70 border-dark-border hover:text-white',
        )}
      >
        Todas
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={cx(
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border',
            activeId === category.id
              ? 'bg-primary text-white border-primary'
              : 'bg-transparent text-beige/70 border-dark-border hover:text-white',
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
