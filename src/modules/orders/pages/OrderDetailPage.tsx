import React from "react";
import { useParams } from "react-router-dom";

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="max-w-3xl p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-display font-bold mb-4">
          Detalle del Pedido
        </h1>
        <p className="text-neutral-600">ID del pedido: {id}</p>
      </div>
    </div>
  );
};
