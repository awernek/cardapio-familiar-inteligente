import { memo } from 'react';
import PropTypes from 'prop-types';
import { ShoppingCart } from 'lucide-react';

/**
 * Componente de lista de compras
 */
export const ShoppingList = memo(({ shoppingList, onInteraction }) => {
  return (
    <section 
      className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
      onClick={onInteraction}
      aria-labelledby="shopping-list-heading"
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <ShoppingCart className="text-blue-600 flex-shrink-0" size={24} aria-hidden="true" />
        <h2 id="shopping-list-heading" className="text-xl sm:text-2xl font-bold text-gray-800">Lista de Compras</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {Object.entries(shoppingList).map(([category, items]) => (
          <div key={category} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base capitalize">
              {category.replace(/_/g, ' ')}
            </h3>
            <ul className="space-y-1">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
});

ShoppingList.displayName = 'ShoppingList';

ShoppingList.propTypes = {
  shoppingList: PropTypes.shape({
    frutas_vegetais: PropTypes.arrayOf(PropTypes.string),
    proteinas: PropTypes.arrayOf(PropTypes.string),
    graos_cereais: PropTypes.arrayOf(PropTypes.string),
    laticinios: PropTypes.arrayOf(PropTypes.string),
    temperos_outros: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onInteraction: PropTypes.func,
};
