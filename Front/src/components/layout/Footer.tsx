import React from 'react';

const Footer: React.FC = () => (
  <footer
    className="border-t border-[var(--border-color)] py-5 px-6 text-center"
    style={{ backgroundColor: 'var(--secondary-bg)' }}
  >
    <p className="text-sm text-[var(--text-secondary)]">
      © 2026{' '}
      <span className="text-[var(--accent-primary)] font-semibold">VehicleMgmt</span>
      {' '}— Todos los derechos reservados.
    </p>
  </footer>
);

export default Footer;
