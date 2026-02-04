import { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'lucide-react';
import { generateWeeklyPriorities, generateInsights } from '../../utils/menuLogic';
import { MenuDataShape, ProfileShape, IndividualAnswersShape, WeeklyContextShape, LastWeekComparisonShape, GamificationShape } from '../../types';
import { MenuActions } from './MenuStep/MenuActions';
import { CostEstimate } from './MenuStep/CostEstimate';
import { DayCard } from './MenuStep/DayCard';
import { ShoppingList } from './MenuStep/ShoppingList';
import { VariationModal } from './MenuStep/VariationModal';
import { SharePrompt } from './MenuStep/SharePrompt';
import { replaceMeal, suggestVariations } from '../../services/menuAdjustmentsService';

/**
 * Formata o cardápio para texto (WhatsApp/compartilhar)
 */
const formatMenuForShare = (menuData, profiles) => {
  const familyNames = profiles.map(p => p.name).join(', ');
  let text = `🍽️ *CARDÁPIO SEMANAL*\n`;
  text += `👨‍👩‍👧‍👦 Família: ${familyNames}\n`;
  text += `📅 Gerado em: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
  
  // Estimativa de custo
  if (menuData.costEstimate) {
    text += `💰 *Estimativa de Custo:* R$ ${menuData.costEstimate.min} - R$ ${menuData.costEstimate.max}\n`;
    text += `_(${profiles.length} pessoa${profiles.length > 1 ? 's' : ''}, 7 dias)_\n\n`;
  }
  
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

  // Dica de economia
  if (menuData.costEstimate?.tips) {
    text += `\n💡 *Dica de economia:*\n${menuData.costEstimate.tips}\n`;
  }
  
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
import { GamificationCard } from '../gamification/GamificationCard';

export const MenuStep = ({
  menuData,
  profiles,
  individualAnswers,
  weeklyContext,
  lastWeekComparison,
  expandedDay,
  onToggleDay,
  onReset,
  onViewProgress,
  onShoppingListUsed,
  gamification,
  onUpdateMeal
}) => {
  const MEAL_LABELS = { breakfast: 'café da manhã', lunch: 'almoço', dinner: 'jantar' };

  // Memoizar cálculos pesados
  const priorities = useMemo(() => 
    generateWeeklyPriorities(profiles, individualAnswers, weeklyContext),
    [profiles, individualAnswers, weeklyContext]
  );
  
  const insights = useMemo(() => 
    generateInsights(profiles, individualAnswers),
    [profiles, individualAnswers]
  );
  
  const familyNames = useMemo(() => 
    profiles.map(p => p.name).join(', '),
    [profiles]
  );
  
  // Verifica se todos os dias estão expandidos
  const allExpanded = expandedDay === 'all';

  // Feedback para ações (trocar / variação / repetir)
  const [mealFeedback, setMealFeedback] = useState(null);
  const [adjustmentLoading, setAdjustmentLoading] = useState(null);
  const [variationModal, setVariationModal] = useState(null);

  const REPEAT_STORAGE_KEY = 'nuri_repeat_meals';

  const handleReplaceMeal = useCallback(async (mealKey) => {
    const [dayIndexStr, mealType] = mealKey.split('-');
    const dayIndex = Number(dayIndexStr);
    if (!onUpdateMeal || !menuData?.days?.[dayIndex]) return;
    setAdjustmentLoading(mealKey);
    setMealFeedback(null);
    try {
      const newMeal = await replaceMeal(menuData, dayIndex, mealType, profiles, weeklyContext);
      onUpdateMeal(dayIndex, mealType, newMeal);
      setMealFeedback({ message: 'Refeição trocada com sucesso!', type: 'success' });
      setTimeout(() => setMealFeedback(null), 3000);
    } catch (_) {
      setMealFeedback({ message: 'Não foi possível trocar. Tente novamente.', type: 'error' });
      setTimeout(() => setMealFeedback(null), 4000);
    } finally {
      setAdjustmentLoading(null);
    }
  }, [menuData, profiles, weeklyContext, onUpdateMeal]);

  const handleRepeatMeal = useCallback((mealKey) => {
    const [dayIndex, mealType] = mealKey.split('-');
    const day = menuData.days[Number(dayIndex)];
    const mealText = day?.[mealType]?.base || '';
    try {
      const stored = JSON.parse(localStorage.getItem(REPEAT_STORAGE_KEY) || '[]');
      const entry = { mealKey, text: mealText, at: new Date().toISOString() };
      const updated = [entry, ...stored.filter((e) => e.mealKey !== mealKey)].slice(0, 30);
      localStorage.setItem(REPEAT_STORAGE_KEY, JSON.stringify(updated));
      setMealFeedback({ message: 'Salvo! Vamos considerar na próxima geração.', type: 'success' });
      setTimeout(() => setMealFeedback(null), 3000);
    } catch (_) {
      setMealFeedback({ message: 'Não foi possível salvar.', type: 'error' });
      setTimeout(() => setMealFeedback(null), 3000);
    }
  }, [menuData.days]);

  const handleVariationMeal = useCallback(async (mealKey) => {
    const [dayIndexStr, mealType] = mealKey.split('-');
    const day = menuData?.days?.[Number(dayIndexStr)];
    const mealText = day?.[mealType]?.base || '';
    if (!mealText || !onUpdateMeal) return;
    setAdjustmentLoading(mealKey);
    setMealFeedback(null);
    try {
      const { variations } = await suggestVariations(mealText, mealType, profiles, weeklyContext);
      if (variations && variations.length > 0) {
        setVariationModal({
          mealKey,
          variations,
          mealLabel: MEAL_LABELS[mealType] || mealType,
        });
      } else {
        setMealFeedback({ message: 'Nenhuma variação retornada. Tente novamente.', type: 'error' });
        setTimeout(() => setMealFeedback(null), 3000);
      }
    } catch (_) {
      setMealFeedback({ message: 'Não foi possível sugerir variações. Tente novamente.', type: 'error' });
      setTimeout(() => setMealFeedback(null), 4000);
    } finally {
      setAdjustmentLoading(null);
    }
  }, [menuData, profiles, weeklyContext, onUpdateMeal]);

  const handleVariationSelect = useCallback((variation) => {
    if (!variationModal?.mealKey || !onUpdateMeal) return;
    const [dayIndexStr, mealType] = variationModal.mealKey.split('-');
    onUpdateMeal(Number(dayIndexStr), mealType, variation);
    setVariationModal(null);
    setMealFeedback({ message: 'Variação aplicada!', type: 'success' });
    setTimeout(() => setMealFeedback(null), 3000);
  }, [variationModal, onUpdateMeal]);
  
  // Toggle expandir todos
  const toggleExpandAll = () => {
    onToggleDay(allExpanded ? null : 'all');
  };
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
      <MenuActions
        onPrint={handlePrint}
        onShare={() => shareViaWhatsApp(menuData, profiles)}
        onToggleExpandAll={toggleExpandAll}
        allExpanded={allExpanded}
        onViewProgress={onViewProgress}
      />
      {/* Prioridades da Semana */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-lg p-4 sm:p-6" aria-labelledby="priorities-heading">
        <h3 id="priorities-heading" className="font-bold text-xl sm:text-2xl mb-3">🔮 Prioridades Nutricionais da Semana</h3>
        <ol className="space-y-2" role="list">
          {priorities.map((priority, index) => (
            <li key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-lg p-3">
              <span className="font-bold text-lg sm:text-xl" aria-hidden="true">{index + 1}.</span>
              <p className="text-base sm:text-lg">{priority}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Comparação com semana anterior */}
      {lastWeekComparison && (
        <section className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg p-4 sm:p-6" aria-labelledby="comparison-heading">
          <h3 id="comparison-heading" className="font-bold text-lg sm:text-xl mb-3">📊 Evolução vs Semana Anterior</h3>
          <div className="space-y-3" role="list">
            {lastWeekComparison.map((comp, index) => (
              <article key={index} className="bg-white/10 backdrop-blur rounded-lg p-3" role="listitem">
                <h4 className="font-semibold mb-1 text-sm sm:text-base">{comp.name}</h4>
                <ul className="space-y-1 text-xs sm:text-sm" role="list">
                  {comp.changes.map((change, i) => (
                    <li key={i}>• {change}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Dicas da Semana */}
      <section className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl shadow-lg p-4 sm:p-6" aria-labelledby="weekly-tips-heading">
        <h3 id="weekly-tips-heading" className="font-bold text-lg sm:text-xl mb-2">💡 Dicas para esta semana</h3>
        <p className="text-sm sm:text-base">{menuData.weeklyTips}</p>
      </section>

      {/* Estimativa de Custo */}
      <CostEstimate 
        costEstimate={menuData.costEstimate} 
        profilesCount={profiles.length}
      />

      {/* Observações Individuais */}
      {menuData.individualNotes && Object.keys(menuData.individualNotes).length > 0 && (
        <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6" aria-labelledby="individual-notes-heading">
          <h3 id="individual-notes-heading" className="font-bold text-base sm:text-lg mb-4 text-gray-800">👤 Observações Individuais</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" role="list">
            {Object.entries(menuData.individualNotes).map(([name, note]) => (
              <article key={name} className="bg-purple-50 p-3 sm:p-4 rounded-lg" role="listitem">
                <h4 className="font-semibold text-purple-900 mb-1 text-sm sm:text-base">{name}</h4>
                <p className="text-xs sm:text-sm text-gray-700">{note}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Modal de variações */}
      {variationModal && (
        <VariationModal
          variations={variationModal.variations}
          mealLabel={variationModal.mealLabel}
          onSelect={handleVariationSelect}
          onClose={() => setVariationModal(null)}
        />
      )}

      {/* Feedback de ação (repetir / trocar / variação) */}
      {(mealFeedback || adjustmentLoading) && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            adjustmentLoading
              ? 'bg-blue-100 text-blue-800'
              : mealFeedback.type === 'success'
                ? 'bg-green-100 text-green-800'
                : mealFeedback.type === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
          }`}
        >
          {adjustmentLoading ? 'Aguarde, gerando sugestão...' : mealFeedback?.message}
        </div>
      )}

      {/* Cardápio por Dia */}
      <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6" aria-labelledby="menu-heading">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Calendar className="text-blue-600 flex-shrink-0" size={24} aria-hidden="true" />
          <h2 id="menu-heading" className="text-xl sm:text-2xl font-bold text-gray-800">Cardápio Semanal</h2>
        </div>

        <ol className="space-y-0" role="list">
          {menuData.days.map((day, index) => (
            <li key={index}>
              <DayCard
                day={day}
                index={index}
                expandedDay={expandedDay}
                onToggleDay={onToggleDay}
                onReplaceMeal={handleReplaceMeal}
                onRepeatMeal={handleRepeatMeal}
                onVariationMeal={handleVariationMeal}
              />
            </li>
          ))}
        </ol>
      </section>

      {/* Lista de Compras */}
      <ShoppingList
        shoppingList={menuData.shoppingList}
        onInteraction={() => onShoppingListUsed && onShoppingListUsed()}
      />

      {/* Indicação orgânica: compartilhar cardápio / link do app */}
      <SharePrompt shareCardapioText={formatMenuForShare(menuData, profiles)} />

      {/* Gamificação */}
      {gamification && (
        <GamificationCard 
          missions={gamification.missions}
          achievements={gamification.achievements}
          level={gamification.level}
        />
      )}

      <button
        onClick={onReset}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label="Criar um novo cardápio do zero"
      >
        Criar Novo Cardápio
      </button>
    </div>
  );
};

MenuStep.propTypes = {
  menuData: MenuDataShape.isRequired,
  profiles: PropTypes.arrayOf(ProfileShape).isRequired,
  individualAnswers: IndividualAnswersShape.isRequired,
  weeklyContext: WeeklyContextShape.isRequired,
  lastWeekComparison: LastWeekComparisonShape,
  expandedDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onToggleDay: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onViewProgress: PropTypes.func.isRequired,
  onShoppingListUsed: PropTypes.func.isRequired,
  gamification: GamificationShape.isRequired,
  onUpdateMeal: PropTypes.func,
};
