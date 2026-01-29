import PropTypes from 'prop-types';
import { useState } from 'react';
import { ArrowLeft, Calendar, Users, ChevronRight, Utensils, ShoppingCart, Trash2, Eye } from 'lucide-react';

/**
 * Página de histórico de cardápios
 */
export const HistoryPage = ({ menuHistory, onBack, onViewMenu, onDeleteMenu }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatWeekRange = (weekStart) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    return `${start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`;
  };

  const handleDelete = async (menuId) => {
    if (onDeleteMenu) {
      await onDeleteMenu(menuId);
    }
    setShowDeleteConfirm(null);
  };

  // Visualização detalhada de um cardápio
  if (selectedMenu) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <button
          onClick={() => setSelectedMenu(null)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} />
          Voltar ao histórico
        </button>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Cardápio da Semana
          </h2>
          <p className="text-sm text-gray-500">
            {formatWeekRange(selectedMenu.week_start)} • Criado em {formatDate(selectedMenu.created_at)}
          </p>
        </div>

        {/* Dias do cardápio */}
        <div className="space-y-4">
          {selectedMenu.menu_data?.days?.map((day, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar size={18} className="text-green-600" />
                {day.day}
              </h3>
              
              <div className="grid gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Café da manhã:</span>
                  <p className="text-gray-800">{day.breakfast?.base || '-'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Almoço:</span>
                  <p className="text-gray-800">{day.lunch?.base || '-'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Jantar:</span>
                  <p className="text-gray-800">{day.dinner?.base || '-'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lista de compras */}
        {selectedMenu.menu_data?.shoppingList && (
          <div className="mt-6 border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingCart size={18} className="text-green-600" />
              Lista de Compras
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(selectedMenu.menu_data.shoppingList).map(([category, items]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                    {category.replace(/_/g, ' ')}
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {items?.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botão usar este cardápio */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => onViewMenu?.(selectedMenu)}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Eye size={18} />
            Visualizar Completo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Utensils className="text-green-600" />
          Meus Cardápios
        </h2>
        <p className="text-gray-600">
          Histórico dos cardápios gerados para sua família
        </p>
      </div>

      {menuHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Nenhum cardápio ainda
          </h3>
          <p className="text-gray-500 mb-4">
            Seus cardápios gerados aparecerão aqui
          </p>
          <button
            onClick={onBack}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Criar primeiro cardápio
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {menuHistory.map((menu) => (
            <div
              key={menu.id}
              className="border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:bg-green-50/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedMenu(menu)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Semana {formatWeekRange(menu.week_start)}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span>Criado em {formatDate(menu.created_at)}</span>
                        {menu.profiles_snapshot && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users size={14} />
                              {menu.profiles_snapshot.length} pessoas
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </button>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMenu(menu)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Ver cardápio"
                  >
                    <ChevronRight size={20} />
                  </button>
                  
                  {onDeleteMenu && (
                    <button
                      onClick={() => setShowDeleteConfirm(menu.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir cardápio"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Modal de confirmação de exclusão */}
              {showDeleteConfirm === menu.id && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 mb-3">
                    Tem certeza que deseja excluir este cardápio? Esta ação não pode ser desfeita.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(menu.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Sim, excluir
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

HistoryPage.propTypes = {
  menuHistory: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onViewMenu: PropTypes.func,
  onDeleteMenu: PropTypes.func,
};
