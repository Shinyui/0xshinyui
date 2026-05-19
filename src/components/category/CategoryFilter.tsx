import CategoryTag from './CategoryTag';

interface CategoryFilterProps {
  categories: string[];
  activeCategory?: string;
  showAllButton?: boolean;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  showAllButton = true,
}: CategoryFilterProps) {
  return (
    <div
      className="mb-8 flex flex-wrap gap-2 rounded-lg border p-2"
      style={{
        backgroundColor: 'rgba(16, 27, 30, 0.68)',
        borderColor: 'var(--border-color)',
      }}
    >
      {showAllButton && (
        <CategoryTag
          category="all"
          isActive={!activeCategory}
          href="/"
        />
      )}
      {categories.map((category) => (
        <CategoryTag
          key={category}
          category={category}
          isActive={category === activeCategory}
        />
      ))}
    </div>
  );
}
