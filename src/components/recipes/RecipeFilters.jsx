import PropTypes from 'prop-types';
import { Search, SlidersHorizontal } from 'lucide-react';

/**
 * Filtros e busca da listagem de receitas
 */
export function RecipeFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories = [],
  orderBy,
  onOrderByChange,
}) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar receitas..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-colors"
          aria-label="Buscar receitas"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <span className="flex items-center gap-1 text-sm text-gray-600" aria-hidden="true">
          <SlidersHorizontal size={16} />
          Filtros
        </span>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
          aria-label="Categoria"
        >
          <option value="">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={orderBy}
          onChange={(e) => onOrderByChange(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
          aria-label="Ordenar por"
        >
          <option value="created_at">Mais recentes</option>
          <option value="view_count">Mais vistas</option>
          <option value="title">Nome A–Z</option>
        </select>
      </div>
    </div>
  );
}

RecipeFilters.propTypes = {
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string),
  orderBy: PropTypes.string.isRequired,
  onOrderByChange: PropTypes.func.isRequired,
};
