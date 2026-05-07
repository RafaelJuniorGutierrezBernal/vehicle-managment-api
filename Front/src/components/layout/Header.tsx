import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, LogIn, Car } from 'lucide-react';
import keycloak from '../../keycloak';
import GooeyNav from './GooeyNav';

const Header: React.FC = () => {
  const location = useLocation();
  const userName = keycloak.authenticated
    ? keycloak.tokenParsed?.preferred_username ?? 'Usuario'
    : null;
  const isAdmin =
    keycloak.hasResourceRole('ADMIN') ||
    keycloak.hasRealmRole('ADMIN') ||
    keycloak.hasRealmRole('admin');

  /* Build nav items dynamically based on auth/role */
  const baseItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Ventas', href: '/sales-history' },
  ];
  const navItems = isAdmin
    ? [...baseItems, { label: '+ Agregar', href: '/add-vehicle' }]
    : baseItems;

  /* Determine which GooeyNav item is active */
  const activeIndex = navItems.findIndex(item =>
    item.href === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.href)
  );

  return (
    <>
      {/* SVG gooey filter definition — invisible, required by GooeyNav CSS */}
      <svg className="gooey-filter-defs" aria-hidden="true">
        <defs>
          <filter id="gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="gooey"
            />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
      </svg>

      <header
        className="sticky top-0 z-30 border-b border-[var(--border-color)] backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(17,24,39,0.92)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[#0ea5e9] flex items-center justify-center shadow-md group-hover:shadow-[var(--accent-primary)]/40 transition-shadow duration-300">
              <Car size={16} className="text-[var(--primary-bg)]" strokeWidth={2.5} />
            </div>
            <span className="font-black text-[var(--text-primary)] text-base tracking-tight hidden sm:block">
              Vehicle<span className="text-[var(--accent-primary)]">Mgmt</span>
            </span>
          </Link>

          {/* GooeyNav center */}
          <div className="flex-1 flex justify-center">
            <GooeyNav
              items={navItems}
              particleCount={12}
              particleDistances={[70, 8]}
              particleR={80}
              initialActiveIndex={Math.max(0, activeIndex)}
              animationTime={500}
              timeVariance={400}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>

          {/* Auth area */}
          <div className="flex items-center gap-3 shrink-0">
            {keycloak.authenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[#818cf8] flex items-center justify-center">
                      <span className="text-white text-xs font-bold uppercase">
                        {userName?.charAt(0)}
                      </span>
                    </div>
                    {isAdmin && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--accent-warning)] border-2 border-[var(--secondary-bg)]" title="Admin" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">{userName}</span>
                </div>
                <button
                  onClick={() => keycloak.logout()}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-danger)] hover:border-[var(--accent-danger)]/60 transition-all duration-200"
                  title="Cerrar sesión"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => keycloak.login()}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary-hover)] text-[var(--primary-bg)] hover:opacity-90 transition-opacity shadow-md shadow-[var(--accent-primary)]/20"
              >
                <LogIn size={14} />
                Iniciar Sesión
              </button>
            )}
          </div>

        </div>
      </header>
    </>
  );
};

export default Header;
