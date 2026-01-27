import { Trophy, Target, ChevronRight, Lock } from 'lucide-react';

/**
 * Barra de progresso das missões
 */
const MissionProgress = ({ current, target }) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
        {current}/{target}
      </span>
    </div>
  );
};

/**
 * Card de missão individual
 */
const MissionItem = ({ mission }) => {
  const { icon, title, description, current, target, completed } = mission;
  
  return (
    <div className={`p-3 rounded-lg border-2 transition-all ${
      completed 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-100 hover:border-gray-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
          completed ? 'bg-green-100' : 'bg-gray-100'
        }`}>
          {completed ? '✅' : icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm ${completed ? 'text-green-700' : 'text-gray-800'}`}>
            {title}
          </p>
          <p className="text-xs text-gray-500 mb-2">{description}</p>
          {!completed && <MissionProgress current={current} target={target} />}
        </div>
      </div>
    </div>
  );
};

/**
 * Badge de conquista
 */
const AchievementBadge = ({ achievement }) => {
  const { icon, title, description, unlocked } = achievement;
  
  return (
    <div className={`relative group ${!unlocked ? 'opacity-50' : ''}`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-transform hover:scale-110 ${
        unlocked 
          ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg' 
          : 'bg-gray-200'
      }`}>
        {unlocked ? icon : <Lock size={20} className="text-gray-400" />}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
          <p className="font-medium">{title}</p>
          <p className="opacity-75">{description}</p>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
};

/**
 * Card principal de gamificação
 */
export const GamificationCard = ({ 
  missions, 
  achievements, 
  level,
  compact = false 
}) => {
  const completedMissions = missions.filter(m => m.completed).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
              {level.icon}
            </div>
            <div>
              <p className="font-bold">{level.title}</p>
              <p className="text-xs opacity-80">
                {completedMissions}/{missions.length} missões • {unlockedAchievements} conquistas
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="opacity-60" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com nível */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-lg p-4 sm:p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
            {level.icon}
          </div>
          <div>
            <p className="text-sm opacity-80">Seu nível</p>
            <p className="text-2xl font-bold">{level.title}</p>
            <p className="text-sm opacity-80">
              {unlockedAchievements} de {achievements.length} conquistas
            </p>
          </div>
        </div>
      </div>

      {/* Missões da semana */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-green-600" size={20} />
          <h3 className="font-bold text-gray-800">Missões da Semana</h3>
          <span className="ml-auto text-sm font-medium text-green-600">
            {completedMissions}/{missions.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {missions.map(mission => (
            <MissionItem key={mission.id} mission={mission} />
          ))}
        </div>
      </div>

      {/* Conquistas */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-amber-500" size={20} />
          <h3 className="font-bold text-gray-800">Conquistas</h3>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          {achievements.map(achievement => (
            <AchievementBadge key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
};
