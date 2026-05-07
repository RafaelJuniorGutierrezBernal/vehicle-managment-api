import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import keycloak from '../../keycloak';

const NavBar: React.FC = () => {
  const location = useLocation();

  const activeClass = (path: string) =>
    location.pathname === path
      ? 'text-blue-800 font-semibold border-b-2 border-blue-800'
      : 'text-gray-600 hover:text-black';

  return (
    <nav className="bg-white shadow-sm py-7 px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-blue-700">
            Vehicle Management
          </Link>
          {keycloak.authenticated && keycloak.hasRealmRole('admin') && (
            <Link
              to="/add-vehicle"
              className={activeClass('/add-vehicle') + ' font-medium'}
            >
              Agregar Vehículo
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
