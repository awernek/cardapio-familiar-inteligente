import { X, Award } from 'lucide-react';

/**
 * Toast de notificação quando desbloqueia uma conquista
 */
export const AchievementToast = ({ achievement, onDismiss }) => {
  if (!achievement) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-80 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl shadow-2xl p-4 text-white">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            {achievement.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Award size={16} />
              <span className="text-xs font-medium uppercase tracking-wide opacity-90">
                Nova Conquista!
              </span>
            </div>
            <p className="font-bold text-lg">{achievement.title}</p>
            <p className="text-sm opacity-90">{achievement.description}</p>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
