import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { generateMetaTags } from '../../utils/seo';

/**
 * Wrapper para páginas estáticas com SEO: meta tags, Open Graph, Twitter e Schema.org.
 */
export function SEOPage({ title, description, keywords, url, image, schema, children }) {
  const baseUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const meta = generateMetaTags({
    title,
    description,
    keywords,
    url: baseUrl,
    image,
  });

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        {meta.keywords && <meta name="keywords" content={meta.keywords} />}
        {meta.canonical && <link rel="canonical" href={meta.canonical} />}
        {/* Open Graph */}
        <meta property="og:title" content={meta['og:title']} />
        <meta property="og:description" content={meta['og:description']} />
        <meta property="og:url" content={meta['og:url']} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        {meta['og:image'] && <meta property="og:image" content={meta['og:image']} />}
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta['twitter:title']} />
        <meta name="twitter:description" content={meta['twitter:description']} />
        {meta['twitter:image'] && <meta name="twitter:image" content={meta['twitter:image']} />}
        {/* Schema.org JSON-LD */}
        {schema && (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )}
      </Helmet>
      {children}
    </>
  );
}

SEOPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.string,
  url: PropTypes.string,
  image: PropTypes.string,
  schema: PropTypes.object,
  children: PropTypes.node.isRequired,
};
