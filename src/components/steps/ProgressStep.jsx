import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus, Calendar, User, Moon, Zap, Target, ChevronLeft, CheckCircle } from 'lucide-react';
import { ProfileShape, IndividualAnswersShape, WeekHistoryItemShape } from '../../types';

/**
 * Mapeia valores para scores numéricos para comparação
 */
const getScore = (value, type) => {
  const scores = {
    stress: { 'baixo': 4, 'normal': 3, 'alto': 2, 'muito-alto': 1 },
    sleep: { 'ótimo': 4, 'bom': 3, 'ruim': 2, 'péssimo': 1 },
    energy: { 'alta': 4, 'normal': 3, 'baixa': 2, 'muito-baixa': 1 },
    appetite: { 'normal': 3, 'aumentado': 2, 'diminuído': 2, 'sem-apetite': 1 },
    followedPlan: { 'sim': 3, 'parcialmente': 2, 'nao': 1, '': 0 }
  };
  return scores[type]?.[value] || 0;
};

/**
 * Retorna ícone de tendência
 */
const TrendIcon = ({ current, previous, type, inverse = false }) => {
  const currentScore = getScore(current, type);
  const previousScore = getScore(previous, type);
  
  if (!previous || currentScore === previousScore) {
    return <Minus className="text-gray-400" size={16} />;
  }
  
  const improved = inverse ? currentScore < previousScore : currentScore > previousScore;
  
  if (improved) {
    return <TrendingUp className="text-green-500" size={16} />;
  }
  return <TrendingDown className="text-red-500" size={16} />;
};

/**
 * Card de métrica individual
 */
const MetricCard = ({ icon: Icon, iconBg, label, currentValue, previousValue, type, displayValue }) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center`}>
          <Icon size={16} className="text-current" />
        </div>
        <span className="text-sm text-gray-600">{label}</span>
        <div className="ml-auto">
          <TrendIcon current={currentValue} previous={previousValue} type={type} />
        </div>
      </div>
      <p className="text-lg font-semibold text-gray-800 capitalize">
        {displayValue || currentValue || '—'}
      </p>
      {previousValue && previousValue !== currentValue && (
        <p className="text-xs text-gray-400 mt-1">
          Semana passada: {previousValue}
        </p>
      )}
    </div>
  );
};

/**
 * Componente de Progresso Semanal
 */
export const ProgressStep = ({
  profiles,
  individualAnswers,
  weekHistory,
  onBack
}) => {
  // Pega dados da semana anterior (se existir)
  const lastWeek = weekHistory?.[0];
  
  // Calcula resumo geral
  const getOverallTrend = () => {
    if (!lastWeek) return null;
    
    let improvements = 0;
    let declines = 0;
    
    profiles.forEach(profile => {
      const current = individualAnswers[profile.id] || {};
      const previous = lastWeek.profiles?.find(p => p.name === profile.name)?.answers || {};
      
      ['stress', 'sleep', 'energy'].forEach(metric => {
        const currentScore = getScore(current[metric], metric);
        const previousScore = getScore(previous[metric], metric);
        
        if (currentScore > previousScore) improvements++;
        if (currentScore < previousScore) declines++;
      });
    });
    
    if (improvements > declines) return 'improving';
    if (declines > improvements) return 'declining';
    return 'stable';
  };
  
  const overallTrend = getOverallTrend();

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <TrendingUp className="text-purple-600" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Evolução da Família
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Veja como vocês estão progredindo semana a semana
            </p>
          </div>
        </div>

        {/* Resumo geral */}
        {overallTrend && (
          <div className={`rounded-xl p-4 ${
            overallTrend === 'improving' ? 'bg-green-50 border border-green-200' :
            overallTrend === 'declining' ? 'bg-red-50 border border-red-200' :
            'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              {overallTrend === 'improving' && (
                <>
                  <div className="text-2xl">📈</div>
                  <div>
                    <p className="font-semibold text-green-800">Tendência positiva!</p>
                    <p className="text-sm text-green-700">A família está melhorando em relação à semana passada.</p>
                  </div>
                </>
              )}
              {overallTrend === 'declining' && (
                <>
                  <div className="text-2xl">📉</div>
                  <div>
                    <p className="font-semibold text-red-800">Atenção necessária</p>
                    <p className="text-sm text-red-700">Alguns indicadores pioraram. Vamos ajustar o cardápio.</p>
                  </div>
                </>
              )}
              {overallTrend === 'stable' && (
                <>
                  <div className="text-2xl">➡️</div>
                  <div>
                    <p className="font-semibold text-gray-800">Estável</p>
                    <p className="text-sm text-gray-600">Os indicadores estão se mantendo.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {!lastWeek && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <p className="font-semibold text-blue-800">Primeira semana!</p>
                <p className="text-sm text-blue-700">
                  Continue usando o app para ver sua evolução ao longo do tempo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cards por pessoa */}
      {profiles.map(profile => {
        const current = individualAnswers[profile.id] || {};
        const previousProfile = lastWeek?.profiles?.find(p => p.name === profile.name);
        const previous = previousProfile?.answers || {};

        return (
          <div key={profile.id} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="text-blue-600" size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{profile.name}</h3>
                <p className="text-xs text-gray-500">{profile.age} anos • {profile.weight}kg</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                icon={Zap}
                iconBg="bg-yellow-100 text-yellow-600"
                label="Estresse"
                currentValue={current.stress}
                previousValue={previous.stress}
                type="stress"
                displayValue={
                  current.stress === 'baixo' ? 'Tranquilo' :
                  current.stress === 'normal' ? 'Normal' :
                  current.stress === 'alto' ? 'Alto' :
                  current.stress === 'muito-alto' ? 'Muito alto' : null
                }
              />
              
              <MetricCard
                icon={Moon}
                iconBg="bg-indigo-100 text-indigo-600"
                label="Sono"
                currentValue={current.sleep}
                previousValue={previous.sleep}
                type="sleep"
                displayValue={
                  current.sleep === 'ótimo' ? 'Ótimo' :
                  current.sleep === 'bom' ? 'Bom' :
                  current.sleep === 'ruim' ? 'Ruim' :
                  current.sleep === 'péssimo' ? 'Péssimo' : null
                }
              />
              
              <MetricCard
                icon={Zap}
                iconBg="bg-green-100 text-green-600"
                label="Energia"
                currentValue={current.energy}
                previousValue={previous.energy}
                type="energy"
                displayValue={
                  current.energy === 'alta' ? 'Alta' :
                  current.energy === 'normal' ? 'Normal' :
                  current.energy === 'baixa' ? 'Baixa' :
                  current.energy === 'muito-baixa' ? 'Exausto' : null
                }
              />
              
              <MetricCard
                icon={Target}
                iconBg="bg-purple-100 text-purple-600"
                label="Adesão ao plano"
                currentValue={current.followedPlan}
                previousValue={previous.followedPlan}
                type="followedPlan"
                displayValue={
                  current.followedPlan === 'sim' ? 'Seguiu' :
                  current.followedPlan === 'parcialmente' ? 'Em parte' :
                  current.followedPlan === 'nao' ? 'Não seguiu' :
                  'Primeira vez'
                }
              />
            </div>

            {/* Sintomas e preferências */}
            {(current.symptoms || current.preferences) && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                {current.symptoms && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Sintomas:</span> {current.symptoms}
                  </p>
                )}
                {current.preferences && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Preferências:</span> {current.preferences}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Histórico resumido */}
      {weekHistory && weekHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-gray-600" size={20} />
            <h3 className="font-semibold text-gray-800">Semanas anteriores</h3>
          </div>
          
          <div className="space-y-2">
            {weekHistory.slice(0, 4).map((week, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{week.dateLabel}</p>
                  <p className="text-xs text-gray-500">
                    {week.profiles?.length || 0} {week.profiles?.length === 1 ? 'pessoa' : 'pessoas'}
                  </p>
                </div>
                <CheckCircle className="text-green-500" size={18} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botão voltar */}
      <button
        onClick={onBack}
        className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
      >
        <ChevronLeft size={18} />
        Voltar
      </button>
    </div>
  );
};

ProgressStep.propTypes = {
  profiles: PropTypes.arrayOf(ProfileShape).isRequired,
  individualAnswers: IndividualAnswersShape.isRequired,
  weekHistory: PropTypes.arrayOf(WeekHistoryItemShape).isRequired,
  onBack: PropTypes.func.isRequired,
};
