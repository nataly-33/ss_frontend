import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-light text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display font-bold text-accent-chocolate mb-4">
              SmartSales365
            </h3>
            <p className="text-sm mb-4">
              Tu tienda de moda favorita. Estilo único para cada ocasión.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-dark transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-dark transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-dark transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-accent-chocolate mb-4">Tienda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/products"
                  className="hover:text-primary-dark transition-colors"
                >
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link
                  to="/new-arrivals"
                  className="hover:text-primary-dark transition-colors"
                >
                  Nuevos Ingresos
                </Link>
              </li>
              <li>
                <Link
                  to="/featured"
                  className="hover:text-primary-dark transition-colors"
                >
                  Destacados
                </Link>
              </li>
              <li>
                <Link to="/sale" className="hover:text-primary-dark transition-colors">
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-accent-chocolate mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary-dark transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-primary-dark transition-colors"
                >
                  Envíos
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-primary-dark transition-colors"
                >
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-primary-dark transition-colors"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-accent-chocolate mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="flex-shrink-0" />
                <span>Cochabamba, Bolivia</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0" />
                <span>+591 70000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <span>info@smartsales365.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-400">
            © 2025 SmartSales365. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Privacidad
            </Link>
            <Link
              to="/terms"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Términos
            </Link>
            <Link
              to="/cookies"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
