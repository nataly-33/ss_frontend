import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@shared/components/ui/Button";
import { PUBLIC_ROUTES } from "@/core/config/routes";

export function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-light rounded-full mb-6">
          <ShoppingBag className="w-12 h-12 text-primary-main" />
        </div>
        
        <h2 className="text-3xl font-display font-bold text-text-primary mb-4">
          Tu carrito está vacío
        </h2>
        
        <p className="text-text-secondary mb-8">
          ¡Descubre nuestros productos y encuentra algo especial para ti!
        </p>
        
        <Link to={PUBLIC_ROUTES.PRODUCTS}>
          <Button variant="primary" size="lg">
            Explorar productos
          </Button>
        </Link>
      </div>
    </div>
  );
}
