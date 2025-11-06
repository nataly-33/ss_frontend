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
    <div className="relative w-full h-[60vh] md:h-[70vh] bg-neutral-100">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination-custom",
          bulletClass:
            "inline-block w-3 h-3 rounded-full bg-white/50 mx-1 cursor-pointer transition-all",
          bulletActiveClass: "w-8 bg-white",
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
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${slide.image})`,
                }}
              />

              {/* Content Container - FIXED Z-INDEX */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8">
                      {slide.subtitle}
                    </p>
                    href={slide.link}
                    className="inline-block px-8 py-3 bg-primary-500 text-white
                    font-medium rounded-lg hover:bg-primary-600
                    transition-colors duration-200 shadow-lg"
                    <a>{slide.cta}</a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons - FIXED Z-INDEX */}
        <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 group shadow-lg">
          <ChevronLeft
            className="text-neutral-800 group-hover:text-primary-600"
            size={20}
          />
        </button>
        <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 group shadow-lg">
          <ChevronRight
            className="text-neutral-800 group-hover:text-primary-600"
            size={20}
          />
        </button>

        {/* Custom Pagination - FIXED Z-INDEX */}
        <div className="swiper-pagination-custom absolute bottom-6 left-0 right-0 z-20 flex justify-center"></div>
      </Swiper>
    </div>
  );
};
