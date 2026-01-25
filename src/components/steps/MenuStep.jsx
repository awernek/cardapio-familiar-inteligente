import { Calendar, ShoppingCart, ChevronDown, ChevronUp, Printer, Share2 } from 'lucide-react';
import { generateWeeklyPriorities, generateInsights } from '../../utils/menuLogic';

/**
 * Formata o cardápio para texto (WhatsApp/compartilhar)
 */
const formatMenuForShare = (menuData, profiles) => {
  const familyNames = profiles.map(p => p.name).join(', ');
  let text = `🍽️ *CARDÁPIO SEMANAL*\n`;
  text += `👨‍👩‍👧‍👦 Família: ${familyNames}\n`;
  text += `📅 Gerado em: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
  
  text += `💡 *Dicas da Semana:*\n${menuData.weeklyTips}\n\n`;
  
  text += `📋 *CARDÁPIO:*\n`;
  text += `━━━━━━━━━━━━━━━━━━\n`;
  
  menuData.days.forEach(day => {
    text += `\n*${day.day}*\n`;
    text += `☀️ Café: ${day.breakfast.base}\n`;
    text += `🍽️ Almoço: ${day.lunch.base}\n`;
    text += `🌙 Jantar: ${day.dinner.base}\n`;
  });
  
  text += `\n🛒 *LISTA DE COMPRAS:*\n`;
  text += `━━━━━━━━━━━━━━━━━━\n`;
  
  Object.entries(menuData.shoppingList).forEach(([category, items]) => {
    text += `\n*${category.replace(/_/g, ' ').toUpperCase()}:*\n`;
    items.forEach(item => {
      text += `  ☐ ${item}\n`;
    });
  });
  
  return text;
};

/**
 * Compartilha via WhatsApp
 */
const shareViaWhatsApp = (menuData, profiles) => {
  const text = formatMenuForShare(menuData, profiles);
  const encodedText = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encodedText}`, '_blank');
};

/**
 * Imprime o cardápio
 */
const handlePrint = () => {
  window.print();
};

/**
 * Componente da etapa de cardápio gerado
 */
export const MenuStep = ({
  menuData,
  profiles,
  individualAnswers,
  weeklyContext,
  lastWeekComparison,
  expandedDay,
  onToggleDay,
  onReset
}) => {
  const priorities = generateWeeklyPriorities(profiles, individualAnswers, weeklyContext);
  const insights = generateInsights(profiles, individualAnswers);
  
  // Verifica se todos os dias estão expandidos
  const allExpanded = expandedDay === 'all';
  
  // Toggle expandir todos
  const toggleExpandAll = () => {
    onToggleDay(allExpanded ? null : 'all');
  };

  const familyNames = profiles.map(p => p.name).join(', ');
  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-4 sm:space-y-6 print:space-y-2">
      {/* Cabeçalho de Impressão - só aparece ao imprimir */}
      <div className="hidden print:block text-center mb-4 pb-3 border-b-2 border-green-500">
        <h1 className="text-2xl font-bold text-gray-800">🍽️ Cardápio Semanal</h1>
        <p className="text-gray-600">Família: {familyNames}</p>
        <p className="text-sm text-gray-500">Gerado em: {currentDate}</p>
      </div>

      {/* Botões de Ação - esconde na impressão */}
      <div className="flex flex-wrap gap-2 sm:gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          <Printer size={18} />
          Imprimir / PDF
        </button>
        <button
          onClick={() => shareViaWhatsApp(menuData, profiles)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
        >
          <Share2 size={18} />
          WhatsApp
        </button>
        <button
          onClick={toggleExpandAll}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
        >
          <ChevronDown size={18} />
          {allExpanded ? 'Recolher Dias' : 'Expandir Todos'}
        </button>
      </div>
      {/* Prioridades da Semana */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-lg p-4 sm:p-6">
        <h3 className="font-bold text-xl sm:text-2xl mb-3">🔮 Prioridades Nutricionais da Semana</h3>
        <div className="space-y-2">
          {priorities.map((priority, index) => (
            <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-lg p-3">
              <span className="font-bold text-lg sm:text-xl">{index + 1}.</span>
              <p className="text-base sm:text-lg">{priority}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparação com semana anterior */}
      {lastWeekComparison && (
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="font-bold text-lg sm:text-xl mb-3">📊 Evolução vs Semana Anterior</h3>
          <div className="space-y-3">
            {lastWeekComparison.map((comp, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-lg p-3">
                <p className="font-semibold mb-1 text-sm sm:text-base">{comp.name}</p>
                <ul className="space-y-1 text-xs sm:text-sm">
                  {comp.changes.map((change, i) => (
                    <li key={i}>• {change}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dicas da Semana */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl shadow-lg p-4 sm:p-6">
        <h3 className="font-bold text-lg sm:text-xl mb-2">💡 Dicas para esta semana</h3>
        <p className="text-sm sm:text-base">{menuData.weeklyTips}</p>
      </div>

      {/* Observações Individuais */}
      {menuData.individualNotes && Object.keys(menuData.individualNotes).length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="font-bold text-base sm:text-lg mb-4 text-gray-800">👤 Observações Individuais</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {Object.entries(menuData.individualNotes).map(([name, note]) => (
              <div key={name} className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                <p className="font-semibold text-purple-900 mb-1 text-sm sm:text-base">{name}</p>
                <p className="text-xs sm:text-sm text-gray-700">{note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cardápio por Dia */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Calendar className="text-blue-600 flex-shrink-0" size={24} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Cardápio Semanal</h2>
        </div>

        {menuData.days.map((day, index) => (
          <div key={index} className="border-b border-gray-200 last:border-0">
            <button
              onClick={() => onToggleDay(expandedDay === index ? null : index)}
              className="w-full py-3 sm:py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-800 text-sm sm:text-base">{day.day}</span>
              {expandedDay === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {(expandedDay === index || expandedDay === 'all') && (
              <div className="pb-4 space-y-3 sm:space-y-4">
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
            )}
          </div>
        ))}
      </div>

      {/* Lista de Compras */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <ShoppingCart className="text-blue-600 flex-shrink-0" size={24} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Lista de Compras</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {Object.entries(menuData.shoppingList).map(([category, items]) => (
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
      </div>

      <button
        onClick={onReset}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
      >
        Criar Novo Cardápio
      </button>
    </div>
  );
};
