import PropTypes from 'prop-types';
import { X } from 'lucide-react';

/**
 * Modal para escolher uma variação de refeição
 */
export function VariationModal({ variations, mealLabel, onSelect, onClose }) {
  if (!variations || variations.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="variation-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="variation-modal-title" className="text-lg font-semibold text-gray-800">
            Escolha uma variação para o {mealLabel}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-3">
          {variations.map((v, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(v)}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <p className="text-gray-800 font-medium">{v.base}</p>
              {v.adaptations && Object.keys(v.adaptations).length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {Object.entries(v.adaptations).map(([name, text]) => `${name}: ${text}`).join(' • ')}
                </p>
              )}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

VariationModal.propTypes = {
  variations: PropTypes.arrayOf(
    PropTypes.shape({
      base: PropTypes.string.isRequired,
      adaptations: PropTypes.object,
    })
  ),
  mealLabel: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
