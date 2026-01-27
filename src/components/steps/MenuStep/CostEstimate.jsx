import { memo } from 'react';
import PropTypes from 'prop-types';
import { Wallet, TrendingDown, AlertCircle } from 'lucide-react';

/**
 * Componente de estimativa de custo
 */
export const CostEstimate = memo(({ costEstimate, profilesCount }) => {
  if (!costEstimate) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-green-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Wallet className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">Estimativa de Custo Semanal</h3>
          <p className="text-xs text-gray-500">Valores aproximados para sua região</p>
        </div>
      </div>

      {/* Valor estimado */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl sm:text-4xl font-bold text-green-700">
            R$ {costEstimate.min}
          </span>
          <span className="text-gray-400 text-xl">–</span>
          <span className="text-3xl sm:text-4xl font-bold text-green-700">
            R$ {costEstimate.max}
          </span>
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          para {profilesCount} {profilesCount === 1 ? 'pessoa' : 'pessoas'} • 7 dias
        </p>
      </div>

      {/* Dica de economia */}
      {costEstimate.tips && (
        <div className="flex items-start gap-3 bg-amber-50 rounded-lg p-3 mb-3">
          <TrendingDown className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-medium text-amber-800">Dica para economizar</p>
            <p className="text-xs text-amber-700">{costEstimate.tips}</p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-xs text-gray-500">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <p>{costEstimate.disclaimer || 'Valores estimados. Preços podem variar conforme estabelecimento e região.'}</p>
      </div>
    </div>
  );
});

CostEstimate.displayName = 'CostEstimate';

CostEstimate.propTypes = {
  costEstimate: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    currency: PropTypes.string,
    disclaimer: PropTypes.string,
    tips: PropTypes.string,
  }),
  profilesCount: PropTypes.number.isRequired,
};
