import { useEffect } from 'react';

interface SEOProps {
  title?: string | null;
  description?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export const useSEO = ({ title, description, metaTitle, metaDescription }: SEOProps = {}) => {
  useEffect(() => {
    // 1. Título de la pestaña
    const finalTitle = metaTitle?.trim() || title?.trim() || 'Baby Shower';
    document.title = finalTitle;

    // 2. Meta descripción
    if (metaDescription || description) {
      const finalDesc = metaDescription?.trim() || description?.trim() || '';
      let metaDescElem = document.querySelector('meta[name="description"]');
      if (!metaDescElem) {
        metaDescElem = document.createElement('meta');
        metaDescElem.setAttribute('name', 'description');
        document.head.appendChild(metaDescElem);
      }
      metaDescElem.setAttribute('content', finalDesc);
    }
  }, [title, description, metaTitle, metaDescription]);
};
