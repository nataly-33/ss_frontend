import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ChevronLeft,
  Star,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import { Button } from "@shared/components/ui/Button";
import { productsService } from "@modules/products/services/products.service";
import { useCartStore } from "@core/store/cart.store";
import { useAuthStore } from "@core/store/auth.store";
import type { Product } from "@modules/products/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productsService.getProduct(slug!);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor selecciona una talla");
      return;
    }

    if (!isAuthenticated) {
      navigate("/login?redirect=" + window.location.pathname);
      return;
    }

    if (product) {
      const talla = product.tallas_disponibles_detalle?.find(
        (t: any) => t.id === selectedSize
      );
      if (talla) {
        addItem({
          id: `${product.id}-${selectedSize}`,
          prenda: product,
          talla: talla,
          cantidad: quantity,
        });
        alert("Producto agregado al carrito");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.imagenes || [];
  const mainImage = product.imagen_principal || "/images/placeholder.jpg";
  const allImages =
    images.length > 0 ? images.map((img: any) => img.imagen) : [mainImage];

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-neutral-600 hover:text-primary-600 mb-6"
        >
          <ChevronLeft size={20} />
          <span>Volver</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <Swiper
              modules={[Navigation, Thumbs]}
              navigation
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              className="mb-4 rounded-2xl overflow-hidden aspect-[3/4] bg-neutral-100"
            >
              {allImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`${product.nombre} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <Swiper
                modules={[FreeMode, Thumbs]}
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode
                watchSlidesProgress
                className="thumbs-swiper"
              >
                {allImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg cursor-pointer"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <p className="text-sm text-neutral-500 uppercase tracking-wide mb-2">
                {product.marca_detalle?.nombre}
              </p>
              <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                {product.nombre}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">(0 reseñas)</span>
              </div>
              <p className="text-3xl font-bold text-primary-600">
                ${product.precio}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-2">
                Descripción
              </h3>
              <p className="text-neutral-700">{product.descripcion}</p>
            </div>

            {/* Color */}
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Color</h3>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 border-2 border-primary-500 bg-primary-50 rounded-lg">
                  <span className="text-sm font-medium text-primary-700">
                    {product.color}
                  </span>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Talla</h3>
              <div className="flex flex-wrap gap-3">
                {product.tallas_disponibles_detalle?.map((size: any) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`
                      w-12 h-12 rounded-lg border-2 font-medium transition-all
                      ${
                        selectedSize === size.id
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-neutral-300 text-neutral-700 hover:border-neutral-400"
                      }
                    `}
                  >
                    {size.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Cantidad</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-neutral-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-neutral-50"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-6 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-neutral-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <p className="text-sm text-neutral-600">
                  {product.tiene_stock ? (
                    <span className="text-green-600">En stock</span>
                  ) : (
                    <span className="text-red-600">Agotado</span>
                  )}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.tiene_stock}
              >
                <ShoppingCart size={20} className="mr-2" />
                Agregar al Carrito
              </Button>
              <button className="p-4 border-2 border-neutral-300 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-colors">
                <Heart size={24} />
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-neutral-200 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-neutral-700">
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Envío gratis en compras mayores a $100</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-700">
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Devoluciones gratis en 30 días</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-700">
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Pago seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
