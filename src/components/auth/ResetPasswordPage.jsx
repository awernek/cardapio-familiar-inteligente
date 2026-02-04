import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Página de recuperação de senha:
 * - Modo 1: usuário informa email e recebe o link
 * - Modo 2: após clicar no link do email, define a nova senha
 */
export function ResetPasswordPage() {
  const {
    isPasswordRecovery,
    resetPasswordForEmail,
    updatePassword,
    clearPasswordRecovery,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const goHome = () => {
    window.location.href = '/';
  };

  // Solicitar link de redefinição
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { error: err } = await resetPasswordForEmail(email);
      if (err) {
        setError(err.message || 'Não foi possível enviar o email.');
      } else {
        setSuccess('Se esse email estiver cadastrado, você receberá um link para redefinir sua senha. Verifique a caixa de entrada e o spam.');
      }
    } catch (_) {
      setError('Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Definir nova senha (após clicar no link do email)
  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await updatePassword(newPassword);
      if (err) {
        setError(err.message || 'Não foi possível alterar a senha.');
      } else {
        setSuccess('Senha alterada com sucesso! Redirecionando...');
        setTimeout(goHome, 2000);
      }
    } catch (_) {
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/nuri-logo-horizontal.png" alt="NURI" className="h-12 w-auto mx-auto mb-2 object-contain" />
          <p className="text-gray-600 text-sm">Nutrição Inteligente</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {!isPasswordRecovery ? (
            <>
              <h1 className="text-xl font-bold text-gray-800 mb-2">Recuperar conta</h1>
              <p className="text-gray-600 text-sm mb-6">
                Digite seu email e enviaremos um link para redefinir sua senha.
              </p>

              <form onSubmit={handleRequestReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
                )}
                {success && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-start gap-2">
                    <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Enviar link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-800 mb-2">Nova senha</h1>
              <p className="text-gray-600 text-sm mb-6">
                Defina uma nova senha para acessar sua conta.
              </p>

              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
                )}
                {success && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">{success}</div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Salvar nova senha'
                  )}
                </button>
              </form>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              if (isPasswordRecovery) clearPasswordRecovery();
              goHome();
            }}
            className="mt-6 w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
          >
            <ArrowLeft size={18} />
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
}
