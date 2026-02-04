import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { generateMetaTags, applyMetaTags } from '../../utils/seo';

/**
 * Wrapper para páginas estáticas com SEO: aplica title e meta description
 * e restaura ao sair da página. Não adiciona dependências (react-helmet).
 */
export function SEOPage({ title, description, keywords, url, children }) {
  const cleanupRef = useRef(null);

  useEffect(() => {
    const meta = generateMetaTags({
      title,
      description,
      keywords,
      url: url || (typeof window !== 'undefined' ? window.location.href : ''),
    });
    cleanupRef.current = applyMetaTags(meta);
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [title, description, keywords, url]);

  return children;
}

SEOPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.string,
  url: PropTypes.string,
  children: PropTypes.node.isRequired,
};
