import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Share2, Link2, MessageCircle } from 'lucide-react';

const DEFAULT_INVITE = 'Experimente o NURI – cardápio semanal com IA para sua família!';

/**
 * Retorna a URL base do app para compartilhar.
 * Em produção: usa VITE_APP_URL se estiver definida (URL canônica do domínio).
 * Caso contrário usa window.location.origin (funciona quando o usuário já está no domínio correto).
 */
function getAppUrl() {
  if (typeof window === 'undefined') return '';
  const canonical = import.meta.env.VITE_APP_URL;
  if (canonical && typeof canonical === 'string' && canonical.startsWith('http')) {
    return canonical.replace(/\/$/, ''); // sem barra no final
  }
  return window.location.origin;
}

/**
 * Indicação orgânica: convite para compartilhar cardápio ou link do app
 * Oferece WhatsApp (cardápio), copiar link e compartilhamento nativo (quando disponível)
 */
export function SharePrompt({
  shareCardapioText,
  inviteMessage = DEFAULT_INVITE,
  className = '',
}) {
  const [copied, setCopied] = useState(false);
  const appUrl = getAppUrl();
  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleCopyLink = useCallback(async () => {
    const text = `${inviteMessage}\n${appUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      setCopied(false);
    }
  }, [appUrl, inviteMessage]);

  const handleWhatsAppCardapio = useCallback(() => {
    if (!shareCardapioText) return;
    const encoded = encodeURIComponent(shareCardapioText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }, [shareCardapioText]);

  const handleNativeShare = useCallback(async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title: 'NURI – Nutrição Inteligente',
        text: inviteMessage,
        url: appUrl,
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Fallback: copiar link
        handleCopyLink();
      }
    }
  }, [canNativeShare, inviteMessage, appUrl, handleCopyLink]);

  return (
    <section
      className={`rounded-2xl shadow-lg p-4 sm:p-6 print:hidden ${className}`}
      aria-labelledby="share-prompt-heading"
      style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0891b2 100%)' }}
    >
      <h2 id="share-prompt-heading" className="text-lg sm:text-xl font-bold text-white mb-2">
        Gostou? Compartilhe com quem você cozinha
      </h2>
      <p className="text-white/90 text-sm sm:text-base mb-4">
        Envie o cardápio por WhatsApp ou indique o app para amigos e família.
      </p>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {shareCardapioText && (
          <button
            type="button"
            onClick={handleWhatsAppCardapio}
            className="inline-flex items-center gap-2 bg-white text-green-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-green-50 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700"
            aria-label="Compartilhar cardápio no WhatsApp"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Enviar cardápio no WhatsApp
          </button>
        )}
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 bg-white/20 text-white border-2 border-white/40 px-4 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700"
          aria-label={copied ? 'Link copiado' : 'Copiar link do app'}
        >
          <Link2 size={18} aria-hidden="true" />
          {copied ? 'Link copiado!' : 'Copiar link do app'}
        </button>
        {canNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 bg-white/20 text-white border-2 border-white/40 px-4 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-700"
            aria-label="Compartilhar (abre menu do sistema)"
          >
            <Share2 size={18} aria-hidden="true" />
            Compartilhar
          </button>
        )}
      </div>
    </section>
  );
}

SharePrompt.propTypes = {
  /** Texto do cardápio formatado para WhatsApp (se não passar, botão WhatsApp não aparece) */
  shareCardapioText: PropTypes.string,
  /** Mensagem de convite ao copiar/compartilhar link */
  inviteMessage: PropTypes.string,
  className: PropTypes.string,
};
