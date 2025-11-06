import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Search, Menu, X, Heart } from "lucide-react";
import { useAuthStore } from "@/core/store/auth.store";
import { useCartStore } from "@core/store/cart.store";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cartItemsCount = items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <nav className="sticky top-0 z-50 bg-background-neutral-600 backdrop-blur-sm border-b border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-display font-bold text-primary-50">
              SmartSales365
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className="text-neutral-700 hover:text-primary-100 transition-colors"
            >
              Catálogo
            </Link>
            <Link
              to="/new-arrivals"
              className="text-neutral-700 hover:text-primary-900 transition-colors"
            >
              Novedades
            </Link>
            <Link
              to="/featured"
              className="text-neutral-700 hover:text-primary-900 transition-colors"
            >
              Destacados
            </Link>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-neutral-700 hover:text-primary-900 transition-colors">
              <Search size={20} />
            </button>

            {isAuthenticated ? (
              <>
                {/* Favorites */}
                <Link
                  to="/favorites"
                  className="p-2 text-neutral-700 hover:text-primary-900 transition-colors"
                >
                  <Heart size={20} />
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative p-2 text-neutral-700 hover:text-primary-900 transition-colors"
                >
                  <ShoppingBag size={20} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-neutral-700 hover:text-primary-600 transition-colors">
                    <User size={20} />
                    <span className="text-sm">{user?.nombre}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-50"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-neutral-700 hover:text-primary-600 transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-neutral-700"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/products"
              className="block text-neutral-700 hover:text-primary-600"
            >
              Catálogo
            </Link>
            <Link
              to="/new-arrivals"
              className="block text-neutral-700 hover:text-primary-600"
            >
              Novedades
            </Link>
            <Link
              to="/featured"
              className="block text-neutral-700 hover:text-primary-600"
            >
              Destacados
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="block text-neutral-700 hover:text-primary-600"
                >
                  Carrito ({cartItemsCount})
                </Link>
                <Link
                  to="/favorites"
                  className="block text-neutral-700 hover:text-primary-600"
                >
                  Favoritos
                </Link>
                <Link
                  to="/profile"
                  className="block text-neutral-700 hover:text-primary-600"
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-neutral-700 hover:text-primary-600"
                >
                  Ingresar
                </Link>
                <Link
                  to="/register"
                  className="block text-neutral-700 hover:text-primary-600"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
