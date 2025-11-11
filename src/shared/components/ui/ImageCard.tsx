import React from "react";

interface ImageCardProps {
  src?: string | null;
  alt: string;
  isAdmin?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Componente ImageCard reutilizable para mostrar imágenes
 * en admin y páginas públicas.
 *
 * - Usa object-fit: contain para mantener proporción sin recortes
 * - Centrado con background blanco
 * - isAdmin=true: contenedor más pequeño (~50% admin/product)
 * - isAdmin=false: tamaño público estándar
 */
export const ImageCard: React.FC<ImageCardProps> = ({
  src,
  alt,
  isAdmin = false,
  onClick,
  className = "",
}) => {
  const containerClasses = isAdmin
    ? "w-32 h-40 md:w-40 md:h-48" // Pequeño para admin (~50% del anterior)
    : "w-48 h-64 md:w-64 md:h-96"; // Público estándar

  return (
    <div
      className={`relative ${containerClasses} bg-white rounded-lg overflow-hidden shadow-sm border border-neutral-200 flex items-center justify-center group ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-xs">{alt || "Sin imagen"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
