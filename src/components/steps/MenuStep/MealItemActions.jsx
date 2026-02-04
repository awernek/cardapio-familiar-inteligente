import PropTypes from 'prop-types';
import { ThumbsDown, Repeat, Shuffle } from 'lucide-react';

/**
 * Ações por refeição (trocar, repetir, sugerir variação).
 * Usado dentro de DayCard para cada slot (café, almoço, jantar).
 */
export function MealItemActions({
  mealKey,
  mealLabel,
  onReplace,
  onRepeat,
  onVariation,
  className = '',
}) {
  return (
    <div
      className={`flex flex-wrap gap-2 mt-2 print:hidden ${className}`}
      role="group"
      aria-label={`Ações para ${mealLabel}`}
    >
      {onReplace && (
        <button
          type="button"
          onClick={() => onReplace(mealKey)}
          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 rounded"
          aria-label={`Não gostei, trocar ${mealLabel}`}
        >
          <ThumbsDown size={14} aria-hidden="true" />
          Trocar
        </button>
      )}
      {onRepeat && (
        <button
          type="button"
          onClick={() => onRepeat(mealKey)}
          className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 hover:underline focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 rounded"
          aria-label={`Repetir ${mealLabel} na próxima semana`}
        >
          <Repeat size={14} aria-hidden="true" />
          Repetir
        </button>
      )}
      {onVariation && (
        <button
          type="button"
          onClick={() => onVariation(mealKey)}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 rounded"
          aria-label={`Sugerir variação de ${mealLabel}`}
        >
          <Shuffle size={14} aria-hidden="true" />
          Variação
        </button>
      )}
    </div>
  );
}

MealItemActions.propTypes = {
  mealKey: PropTypes.string.isRequired,
  mealLabel: PropTypes.string.isRequired,
  onReplace: PropTypes.func,
  onRepeat: PropTypes.func,
  onVariation: PropTypes.func,
  className: PropTypes.string,
};
