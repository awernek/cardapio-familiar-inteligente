import PropTypes from 'prop-types';
import { Clock, Users } from 'lucide-react';

/**
 * Card de receita na listagem
 */
export function RecipeCard({ recipe, isSaved, onSave, saveLabel = 'Salvar' }) {
  const href = `/receita/${recipe.slug}`;
  const totalMin = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <a href={href} className="block focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset rounded-2xl">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt=""
            className="w-full aspect-[4/3] object-cover"
          />
        ) : (
          <div className="w-full aspect-[4/3] bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-green-600 text-4xl" aria-hidden="true">
            🍽️
          </div>
        )}
        <div className="p-4">
          {recipe.category && (
            <span className="text-xs font-medium text-green-600 uppercase tracking-wide">{recipe.category}</span>
          )}
          <h2 className="text-lg font-bold text-gray-900 mt-1 line-clamp-2">{recipe.title}</h2>
          {recipe.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{recipe.description}</p>
          )}
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
            {totalMin > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={14} aria-hidden="true" />
                {totalMin} min
              </span>
            )}
            {recipe.servings > 0 && (
              <span className="flex items-center gap-1">
                <Users size={14} aria-hidden="true" />
                {recipe.servings} porções
              </span>
            )}
            {recipe.view_count > 0 && (
              <span>{recipe.view_count} visualizações</span>
            )}
          </div>
        </div>
      </a>
      {onSave && (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onSave(); }}
            className={`text-sm font-medium rounded-lg px-3 py-1.5 transition-colors ${
              isSaved
                ? 'bg-green-100 text-green-800'
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            {isSaved ? 'Salva' : saveLabel}
          </button>
        </div>
      )}
    </article>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image_url: PropTypes.string,
    prep_time_minutes: PropTypes.number,
    cook_time_minutes: PropTypes.number,
    servings: PropTypes.number,
    category: PropTypes.string,
    view_count: PropTypes.number,
  }).isRequired,
  isSaved: PropTypes.bool,
  onSave: PropTypes.func,
  saveLabel: PropTypes.string,
};
