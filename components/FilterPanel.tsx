'use client';

interface FilterPanelProps {
  filters: {
    type: string;
    category: string;
    size: string;
    color: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Noir', 'Bleu', 'Gris', 'Marron', 'Beige', 'Blanc', 'Autre'];
const categories = [
  { value: '', label: 'Toutes' },
  { value: 'costume', label: 'Costume Complet' },
  { value: 'jacket', label: 'Veste' },
  { value: 'pants', label: 'Pantalon' },
  { value: 'shirt', label: 'Chemise' },
  { value: 'tie', label: 'Cravate' },
  { value: 'belt', label: 'Ceinture' },
  { value: 'wallet', label: 'Portefeuille' },
];

export default function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterPanelProps) {
  const hasActiveFilters = filters.type || filters.category || filters.size || filters.color;

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Filtres</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-400 hover:text-white"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium mb-3">Catégorie</label>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.value} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={cat.value}
                checked={filters.category === cat.value}
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <label className="block text-sm font-medium mb-3">Type</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value=""
              checked={filters.type === ''}
              onChange={(e) => onFilterChange('type', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">Tous</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="sale"
              checked={filters.type === 'sale'}
              onChange={(e) => onFilterChange('type', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">Vente</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="rent"
              checked={filters.type === 'rent'}
              onChange={(e) => onFilterChange('type', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">Location</span>
          </label>
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <label className="block text-sm font-medium mb-3">Taille</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="size"
              value=""
              checked={filters.size === ''}
              onChange={(e) => onFilterChange('size', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">Toutes</span>
          </label>
          {sizes.map((size) => (
            <label key={size} className="flex items-center">
              <input
                type="radio"
                name="size"
                value={size}
                checked={filters.size === size}
                onChange={(e) => onFilterChange('size', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <label className="block text-sm font-medium mb-3">Couleur</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="color"
              value=""
              checked={filters.color === ''}
              onChange={(e) => onFilterChange('color', e.target.value)}
              className="mr-2"
            />
            <span className="text-sm">Toutes</span>
          </label>
          {colors.map((color) => (
            <label key={color} className="flex items-center">
              <input
                type="radio"
                name="color"
                value={color}
                checked={filters.color === color}
                onChange={(e) => onFilterChange('color', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">{color}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

