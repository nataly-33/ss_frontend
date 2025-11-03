import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    image: "/images/banners/hero-1.jpg",
    title: "Nueva Colección",
    subtitle: "Descubre las últimas tendencias",
    cta: "Explorar",
    link: "/products?new=true",
  },
  {
    id: 2,
    image: "/images/banners/hero-2.jpg",
    title: "Ofertas Especiales",
    subtitle: "Hasta 50% de descuento",
    cta: "Ver Ofertas",
    link: "/products?featured=true",
  },
  {
    id: 3,
    image: "/images/banners/hero-3.jpg",
    title: "Estilo Único",
    subtitle: "Prendas exclusivas para ti",
    cta: "Comprar Ahora",
    link: "/products",
  },
];

export const HeroCarousel: React.FC = () => {
  return (
    <div className="relative w-full h-[70vh] bg-neutral-300">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active bg-primary-500",
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        loop
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-xl animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-8">
                      {slide.subtitle}
                    </p>

                    <a
                      href={slide.link}
                      className="inline-block px-8 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors duration-200"
                    >
                      {slide.cta}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation */}
        <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 rounded-full hover:bg-white transition-all duration-200 group">
          <ChevronLeft
            className="text-neutral-800 group-hover:text-primary-600"
            size={24}
          />
        </button>
        <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 rounded-full hover:bg-white transition-all duration-200 group">
          <ChevronRight
            className="text-neutral-800 group-hover:text-primary-600"
            size={24}
          />
        </button>
      </Swiper>
    </div>
  );
};
