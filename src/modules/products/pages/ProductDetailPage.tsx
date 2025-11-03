import React from "react";
import { useParams } from "react-router-dom";

export const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const slug = params.slug ?? "";

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="max-w-3xl p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-display font-bold mb-4">
          Detalle del producto
        </h1>
        <p className="text-sm text-neutral-700">Slug: {slug}</p>
        <p className="mt-4 text-neutral-600">
          Componente placeholder. Implementa la vista real según la API y
          diseño.
        </p>
      </div>
    </div>
  );
};
