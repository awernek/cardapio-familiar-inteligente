import { Calendar, ShoppingCart } from 'lucide-react';
import { generateReportText } from '../../utils/reportGenerator';
import { generateWeeklyPriorities, generateInsights, compareWithLastWeek } from '../../utils/menuLogic';
import { calculateBMI, getBMICategory } from '../../utils/bmi';
import { copyToClipboard } from '../../utils/browserCompatibility';

/**
 * Componente da etapa de relatório
 */
export const ReportStep = ({
  profiles,
  individualAnswers,
  weeklyContext,
  weekHistory,
  showHistory,
  onToggleHistory,
  onBack,
  onContinue
}) => {
  const priorities = generateWeeklyPriorities(profiles, individualAnswers, weeklyContext);
  const insights = generateInsights(profiles, individualAnswers);
  const comparison = weekHistory.length > 0 
    ? compareWithLastWeek(profiles, individualAnswers, weekHistory[0])
    : null;

  const copyReport = async () => {
    const report = generateReportText(
      profiles,
      individualAnswers,
      weeklyContext,
      () => priorities,
      () => insights,
      calculateBMI,
      getBMICategory
    );
    const success = await copyToClipboard(report);
    if (success) {
      alert('✅ Relatório copiado! Cole onde quiser.');
    } else {
      alert('⚠️ Não foi possível copiar automaticamente. Use Ctrl+C após selecionar o texto.');
    }
  };

  const downloadReport = () => {
    const report = generateReportText(
      profiles,
      individualAnswers,
      weeklyContext,
      () => priorities,
      () => insights,
      calculateBMI,
      getBMICategory
    );
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-familiar-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Calendar className="text-blue-600 flex-shrink-0" size={24} />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Relatório Familiar Completo</h2>
      </div>

      {/* Prioridades da Semana */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="font-bold text-xl sm:text-2xl mb-3 flex items-center gap-2">
          🔮 Prioridades Nutricionais da Semana
        </h3>
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
      {comparison && (
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-bold text-lg sm:text-xl mb-3 flex items-center gap-2">
            📊 Comparação com semana anterior
          </h3>
          <div className="space-y-3">
            {comparison.map((comp, index) => (
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

      {/* Histórico toggle */}
      {weekHistory.length > 0 && (
        <button
          onClick={onToggleHistory}
          className="w-full mb-4 sm:mb-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Calendar size={18} />
          {showHistory ? 'Ocultar' : 'Ver'} Histórico ({weekHistory.length} {weekHistory.length === 1 ? 'semana' : 'semanas'})
        </button>
      )}

      {/* Histórico de semanas */}
      {showHistory && weekHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-bold text-base sm:text-lg mb-4">📅 Histórico de Semanas</h3>
          <div className="space-y-3">
            {weekHistory.map((week, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <p className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">{week.dateLabel}</p>
                {week.priorities && (
                  <div className="mb-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Prioridades:</p>
                    <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                      {week.priorities.slice(0, 2).map((p, i) => (
                        <li key={i} className="text-xs">• {p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {week.profiles && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {week.profiles.map((p, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {p.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights em destaque */}
      {insights.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-bold text-lg sm:text-xl mb-4">🔍 Insights da Semana</h3>
          <div className="space-y-4">
            {insights.map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4">
                <p className="font-semibold mb-2 text-sm sm:text-base">{item.name}</p>
                <ul className="space-y-1 text-xs sm:text-sm">
                  {item.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6 font-mono text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap">
        {generateReportText(
          profiles,
          individualAnswers,
          weeklyContext,
          () => priorities,
          () => insights,
          calculateBMI,
          getBMICategory
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={copyReport}
          className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Calendar size={18} />
          Copiar Relatório
        </button>
        <button
          onClick={downloadReport}
          className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <ShoppingCart size={18} />
          Baixar como TXT
        </button>
      </div>

      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <p className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">💡 Como usar este relatório:</p>
        <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
          <li>✅ Compartilhe com seu nutricionista para análise profissional</li>
          <li>✅ Cole no ChatGPT, Claude ou outra IA para gerar cardápios alternativos</li>
          <li>✅ Salve semanalmente para acompanhar evolução da família</li>
          <li>✅ Use para identificar padrões de sono, estresse e alimentação</li>
        </ul>
      </div>

      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base"
        >
          ← Voltar
        </button>
        <button
          onClick={onContinue}
          className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
        >
          Continuar para Gerar Cardápio →
        </button>
      </div>
    </div>
  );
};
