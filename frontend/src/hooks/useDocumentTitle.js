import { useEffect } from 'react';

/**
 * Sets document.title for the current page.
 * Usage: useDocumentTitle('Events'); -> "Events | UPSURGE 2K26"
 */
export default function useDocumentTitle(pageTitle) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = pageTitle ? `${pageTitle} | UPSURGE 2K26` : 'UPSURGE 2K26';
    return () => {
      document.title = previousTitle;
    };
  }, [pageTitle]);
}
