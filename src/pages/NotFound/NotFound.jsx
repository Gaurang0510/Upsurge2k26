import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function NotFound() {
  useDocumentTitle('Case Closed — 404');

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
      <span className="case-tag">Case Status: Unsolved</span>
      <h1 className="heading-display mt-4 text-7xl sm:text-8xl">404</h1>
      <p className="mt-4 text-lg text-steel">This file doesn&apos;t exist in our records. The page you&apos;re looking for was never opened, or has since been closed.</p>
      <Link to="/" className="btn-primary mt-8">
        Return to HQ
      </Link>
    </div>
  );
}
