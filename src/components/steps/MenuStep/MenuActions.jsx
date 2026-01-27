import PropTypes from 'prop-types';
import { Printer, Share2, ChevronDown, TrendingUp } from 'lucide-react';

/**
 * Componente de ações do menu (imprimir, compartilhar, etc)
 */
export const MenuActions = ({
  onPrint,
  onShare,
  onToggleExpandAll,
  allExpanded,
  onViewProgress
}) => {
  return (
    <nav className="flex flex-wrap gap-2 sm:gap-3 print:hidden" aria-label="Ações do cardápio">
      <button
        onClick={onPrint}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Imprimir cardápio ou salvar como PDF"
      >
        <Printer size={18} aria-hidden="true" />
        Imprimir / PDF
      </button>
      <button
        onClick={onShare}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label="Compartilhar cardápio via WhatsApp"
      >
        <Share2 size={18} aria-hidden="true" />
        WhatsApp
      </button>
      <button
        onClick={onToggleExpandAll}
        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        aria-label={allExpanded ? "Recolher todos os dias do cardápio" : "Expandir todos os dias do cardápio"}
        aria-expanded={allExpanded}
      >
        <ChevronDown size={18} aria-hidden="true" />
        {allExpanded ? 'Recolher Dias' : 'Expandir Todos'}
      </button>
      {onViewProgress && (
        <button
          onClick={onViewProgress}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          aria-label="Ver progresso e histórico"
        >
          <TrendingUp size={18} aria-hidden="true" />
          Ver Progresso
        </button>
      )}
    </nav>
  );
};

MenuActions.propTypes = {
  onPrint: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onToggleExpandAll: PropTypes.func.isRequired,
  allExpanded: PropTypes.bool.isRequired,
  onViewProgress: PropTypes.func,
};
