import { memo } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MenuDayShape } from '../../../types';

/**
 * Componente de cardápio de um dia
 */
export const DayCard = memo(({ day, index, expandedDay, onToggleDay }) => {
  const isExpanded = expandedDay === index || expandedDay === 'all';

  return (
    <article className="border-b border-gray-200 last:border-0 print:border-b-2" aria-labelledby={`day-${index}-heading`}>
      <button
        onClick={() => onToggleDay(isExpanded ? null : index)}
        className="w-full py-3 sm:py-4 flex justify-between items-center hover:bg-gray-50 transition-colors print:hidden focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-expanded={isExpanded}
        aria-controls={`day-${index}-content`}
        aria-label={`${isExpanded ? 'Recolher' : 'Expandir'} cardápio de ${day.day}`}
      >
        <span id={`day-${index}-heading`} className="font-semibold text-gray-800 text-sm sm:text-base">{day.day}</span>
        {isExpanded ? <ChevronUp size={20} aria-hidden="true" /> : <ChevronDown size={20} aria-hidden="true" />}
      </button>
      
      {/* Título do dia na impressão */}
      <h3 className="hidden print:block font-bold text-base mb-2 pt-2">{day.day}</h3>
      
      <div 
        id={`day-${index}-content`}
        className={`pb-4 space-y-3 sm:space-y-4 print:block ${isExpanded ? '' : 'hidden'}`}
        role="region"
        aria-labelledby={`day-${index}-heading`}
      >
        {/* Café da Manhã */}
        <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
          <p className="font-medium text-yellow-900 mb-2 text-sm sm:text-base">☀️ Café da manhã</p>
          <p className="text-gray-700 mb-2 text-sm sm:text-base">{day.breakfast.base}</p>
          {day.breakfast.adaptations && Object.keys(day.breakfast.adaptations).length > 0 && (
            <div className="mt-2 space-y-1">
              {Object.entries(day.breakfast.adaptations).map(([name, adaptation]) => (
                <p key={name} className="text-xs sm:text-sm text-yellow-800">
                  <strong>{name}:</strong> {adaptation}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Almoço */}
        <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
          <p className="font-medium text-orange-900 mb-2 text-sm sm:text-base">🍽️ Almoço</p>
          <p className="text-gray-700 mb-2 text-sm sm:text-base">{day.lunch.base}</p>
          {day.lunch.adaptations && Object.keys(day.lunch.adaptations).length > 0 && (
            <div className="mt-2 space-y-1">
              {Object.entries(day.lunch.adaptations).map(([name, adaptation]) => (
                <p key={name} className="text-xs sm:text-sm text-orange-800">
                  <strong>{name}:</strong> {adaptation}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Jantar */}
        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
          <p className="font-medium text-purple-900 mb-2 text-sm sm:text-base">🌙 Jantar</p>
          <p className="text-gray-700 mb-2 text-sm sm:text-base">{day.dinner.base}</p>
          {day.dinner.adaptations && Object.keys(day.dinner.adaptations).length > 0 && (
            <div className="mt-2 space-y-1">
              {Object.entries(day.dinner.adaptations).map(([name, adaptation]) => (
                <p key={name} className="text-xs sm:text-sm text-purple-800">
                  <strong>{name}:</strong> {adaptation}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Lanches Individuais */}
        {day.individualSnacks && (
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <p className="font-medium text-blue-900 mb-3 text-sm sm:text-base">🥤 Lanches Personalizados</p>
            <div className="space-y-3">
              {Object.entries(day.individualSnacks).map(([name, snacks]) => (
                <div key={name} className="bg-white p-3 rounded-lg">
                  <p className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">{name}</p>
                  <p className="text-xs sm:text-sm text-gray-700"><strong>Manhã:</strong> {snacks.snack1}</p>
                  <p className="text-xs sm:text-sm text-gray-700"><strong>Tarde:</strong> {snacks.snack2}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dica do Dia */}
        {day.dayTip && (
          <div className="bg-pink-50 p-3 rounded-lg">
            <p className="font-medium text-pink-900 text-sm sm:text-base">💭 Dica do dia</p>
            <p className="text-gray-700 text-xs sm:text-sm">{day.dayTip}</p>
          </div>
        )}
      </div>
    </article>
  );
});

DayCard.displayName = 'DayCard';

DayCard.propTypes = {
  day: MenuDayShape.isRequired,
  index: PropTypes.number.isRequired,
  expandedDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onToggleDay: PropTypes.func.isRequired,
};
