import { CheckCircle2, Package, Truck, Home } from "lucide-react";

interface OrderTimelineProps {
  estado: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface TimelineStep {
  label: string;
  icon: React.ElementType;
  status: "completed" | "current" | "pending";
}

export function OrderTimeline({
  estado,
  fechaCreacion,
  fechaActualizacion,
}: OrderTimelineProps) {
  const getSteps = (): TimelineStep[] => {
    const steps = [
      { key: "pendiente", label: "Pendiente de pago", icon: CheckCircle2 },
      { key: "pago_recibido", label: "Pago recibido", icon: CheckCircle2 },
      { key: "confirmado", label: "Confirmado", icon: CheckCircle2 },
      { key: "preparando", label: "Preparando", icon: Package },
      { key: "enviado", label: "Enviado", icon: Truck },
      { key: "entregado", label: "Entregado", icon: Home },
    ];

    const estadoIndex = steps.findIndex((s) => s.key === estado);

    return steps.map((step, index) => ({
      label: step.label,
      icon: step.icon,
      status:
        index < estadoIndex
          ? "completed"
          : index === estadoIndex
          ? "current"
          : "pending",
    })) as TimelineStep[];
  };

  const steps = getSteps();

  if (estado === "cancelado") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-display font-bold text-text-primary mb-4">
          Estado del pedido
        </h3>
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-4xl">❌</span>
          </div>
          <p className="text-xl font-display font-bold text-red-700 mb-2">
            Pedido Cancelado
          </p>
          <p className="text-sm text-text-secondary">
            Este pedido fue cancelado el{" "}
            {new Date(fechaActualizacion).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-display font-bold text-text-primary mb-6">
        Seguimiento del pedido
      </h3>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-neutral-200">
          <div
            className="bg-primary-main transition-all duration-500"
            style={{
              height: `${
                (steps.filter((s) => s.status === "completed").length /
                  (steps.length - 1)) *
                100
              }%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={`
                  relative z-10 w-16 h-16 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${
                    step.status === "completed"
                      ? "bg-primary-main text-white shadow-lg"
                      : step.status === "current"
                      ? "bg-primary-main text-white shadow-lg animate-pulse"
                      : "bg-neutral-100 text-neutral-400"
                  }
                `}
              >
                <step.icon className="w-8 h-8" />
              </div>

              {/* Label */}
              <div className="flex-1">
                <p
                  className={`
                    text-lg font-semibold
                    ${
                      step.status === "pending"
                        ? "text-neutral-400"
                        : "text-text-primary"
                    }
                  `}
                >
                  {step.label}
                </p>
                {step.status === "current" && (
                  <p className="text-sm text-text-secondary mt-1">
                    Actualizado el{" "}
                    {new Date(fechaActualizacion).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
                {step.status === "completed" && index === 0 && (
                  <p className="text-sm text-text-secondary mt-1">
                    {new Date(fechaCreacion).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              {/* Check Mark */}
              {step.status === "completed" && (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Delivery */}
      {estado === "enviado" && (
        <div className="mt-6 pt-6 border-t bg-primary-light/30 rounded-lg p-4">
          <p className="text-sm font-semibold text-text-primary mb-1">
            Entrega estimada
          </p>
          <p className="text-text-secondary">
            Tu pedido llegará en los próximos 3-5 días hábiles
          </p>
        </div>
      )}
    </div>
  );
}
