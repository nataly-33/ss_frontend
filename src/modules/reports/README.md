# 📊 Módulo de Reportes - Frontend SmartSales365

## 📋 Descripción

Módulo frontend para el sistema de reportes dinámicos con AI. Permite a los usuarios generar reportes personalizados usando texto o voz, y visualizar analytics del sistema.

---

## 🎯 Características

✅ **Generación con Prompts**: Texto o reconocimiento de voz (Web Speech API)
✅ **Descarga Automática**: PDF, Excel, CSV
✅ **Dashboard Analytics**: Visualizaciones en tiempo real
✅ **TypeScript**: Type-safety completo
✅ **Componentes Reutilizables**: Modulares y escalables

---

## 📁 Estructura del Módulo

```
src/modules/reports/
├── components/                    # Componentes reutilizables
│   ├── StatCard.tsx              # Tarjeta de estadística con icono
│   └── ReportPromptInput.tsx     # Input con texto y voz
├── pages/                        # Páginas principales
│   ├── ReportsPage.tsx           # Generación de reportes
│   └── AnalyticsPage.tsx         # Dashboard de analytics
├── services/                     # Servicios API
│   └── reports.service.ts        # Consumo de endpoints
├── types/                        # Tipos TypeScript
│   └── index.ts                  # Interfaces y tipos
└── README.md                     # Este archivo
```

---

## 🚀 Uso

### 1. Importar en Rutas

Agrega las rutas en `src/core/routes/index.tsx`:

```typescript
import { ReportsPage } from '@/modules/reports/pages/ReportsPage';
import { AnalyticsPage } from '@/modules/reports/pages/AnalyticsPage';

// Dentro de AdminRoute
<Route path="/admin/reports" element={<ReportsPage />} />
<Route path="/admin/analytics" element={<AnalyticsPage />} />
```

### 2. Actualizar Configuración de Rutas

En `src/core/config/routes.ts`:

```typescript
export const ADMIN_ROUTES = {
  ...
  REPORTS: '/admin/reports',
  ANALYTICS: '/admin/analytics',
};
```

### 3. Agregar a Navegación

En `Navbar.tsx` o `AdminDashboard.tsx`:

```tsx
import { FileText, BarChart3 } from 'lucide-react';

<Link to="/admin/reports">
  <FileText /> Reportes
</Link>
<Link to="/admin/analytics">
  <BarChart3 /> Analytics
</Link>
```

---

## 📊 Componentes

### StatCard

Tarjeta para mostrar estadísticas con icono.

**Props:**
```typescript
interface StatCardProps {
  title: string;                  // Título de la estadística
  value: string | number;         // Valor principal
  icon: LucideIcon;              // Icono de lucide-react
  iconColor?: string;            // Color del icono (Tailwind)
  iconBgColor?: string;          // Color de fondo del icono
  trend?: {                      // Tendencia opcional
    value: string;
    isPositive: boolean;
  };
}
```

**Ejemplo:**
```tsx
import { TrendingUp } from 'lucide-react';
import { StatCard } from '../components/StatCard';

<StatCard
  title="Total Ventas"
  value="Bs. 12,345.67"
  icon={TrendingUp}
  iconColor="text-green-600"
  iconBgColor="bg-green-100"
  trend={{
    value: "Bs. 1,234 este mes",
    isPositive: true
  }}
/>
```

---

### ReportPromptInput

Input con soporte para texto y voz.

**Props:**
```typescript
interface ReportPromptInputProps {
  onSubmit: (prompt: string, format: string) => void;
  isLoading: boolean;
}
```

**Ejemplo:**
```tsx
import { ReportPromptInput } from '../components/ReportPromptInput';

const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (prompt: string, format: string) => {
  setIsLoading(true);
  try {
    const blob = await reportsService.generateFromPrompt(prompt);
    const filename = reportsService.generateFilename(prompt, format);
    reportsService.downloadBlob(blob, filename);
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

<ReportPromptInput
  onSubmit={handleSubmit}
  isLoading={isLoading}
/>
```

**Características:**
- Botón de voz con Web Speech API
- Selector de formato (PDF, Excel, CSV)
- Ejemplos de prompts clickeables
- Estados de carga
- Validación de entrada

---

## 🛠️ Servicios

### reportsService

Métodos para generar reportes.

```typescript
import { reportsService } from '../services/reports.service';

// Generar desde prompt
const blob = await reportsService.generateFromPrompt(
  "Ventas del último mes en PDF"
);

// Generar reporte predefinido
const blob = await reportsService.generatePredefined({
  report_type: 'ventas',
  format: 'excel',
  filters: { estado: 'confirmado' }
});

// Descargar blob
reportsService.downloadBlob(blob, 'reporte.pdf');

// Generar nombre de archivo
const filename = reportsService.generateFilename(
  "Ventas de septiembre",
  "pdf"
); // -> reporte_ventas_de_septiembre_2024-11-09.pdf
```

---

### analyticsService

Métodos para obtener analytics.

```typescript
import { analyticsService } from '../services/reports.service';

// Overview completo
const overview = await analyticsService.getOverview({
  months: 12,
  days: 30
});

// Resumen general
const summary = await analyticsService.getSummary();

// Ventas por mes
const sales = await analyticsService.getSales(6);

// Analytics de productos
const products = await analyticsService.getProducts();

// Resumen de inventario
const inventory = await analyticsService.getInventory();

// Analytics de clientes
const customers = await analyticsService.getCustomers();
```

---

## 📄 Páginas

### ReportsPage

Página principal para generar reportes con prompts.

**Ubicación:** `src/modules/reports/pages/ReportsPage.tsx`

**Características:**
- Input de texto con reconocimiento de voz
- Selector de formato (PDF, Excel, CSV)
- Botones de reportes rápidos
- Ejemplos de prompts
- Alertas de éxito/error
- Descarga automática de archivos

**Ruta:** `/admin/reports`

**Prompts de Ejemplo:**
```
"Reporte de ventas del último mes en PDF"
"Top 10 productos más vendidos en Excel"
"Clientes registrados este año en CSV"
"Pedidos pendientes en PDF"
"Ventas agrupadas por categoría en Excel"
```

---

### AnalyticsPage

Dashboard con visualizaciones y estadísticas.

**Ubicación:** `src/modules/reports/pages/AnalyticsPage.tsx`

**Características:**
- 4 tarjetas de estadísticas principales
- Gráfico de ventas por mes (barras horizontales)
- Top 5 productos más vendidos
- Resumen de inventario (4 métricas)
- Carga automática al montar
- Manejo de errores con retry

**Ruta:** `/admin/analytics`

**Datos Mostrados:**
- Total ventas y ventas del mes
- Total pedidos y pedidos del mes
- Total productos y stock bajo
- Total clientes y nuevos del mes
- Ventas mensuales (últimos 6 meses)
- Top productos más vendidos
- Estado del inventario

---

## 🎨 Estilos

El módulo usa **Tailwind CSS** con el sistema de colores de SmartSales365:

```
- Primario: blue-600
- Éxito: green-600
- Advertencia: yellow-600
- Error: red-600
- Neutro: gray-XXX
```

---

## 🔊 Reconocimiento de Voz

### Web Speech API

El componente `ReportPromptInput` usa la Web Speech API del navegador.

**Navegadores Soportados:**
- ✅ Chrome/Edge (Chromium)
- ✅ Safari (macOS/iOS)
- ❌ Firefox (no soportado)

**Código:**
```typescript
const SpeechRecognition =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = 'es-ES';
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event: any) => {
  const transcript = event.results[0][0].transcript;
  setPrompt(transcript);
};

recognition.start();
```

**Limitaciones:**
- Requiere HTTPS en producción
- Timeout de 10-15 segundos sin voz
- Requiere permiso del usuario

---

## 🧪 Testing Manual

### 1. Probar Generación de Reportes

1. Ir a `/admin/reports`
2. Escribir: "Reporte de ventas del último mes en PDF"
3. Hacer clic en "Generar Reporte"
4. Verificar que se descarga un PDF

### 2. Probar Voz

1. Click en botón "Voz" (micrófono)
2. Permitir acceso al micrófono
3. Decir: "Productos más vendidos en Excel"
4. Verificar que el texto aparece en el input

### 3. Probar Analytics

1. Ir a `/admin/analytics`
2. Verificar que cargan las 4 tarjetas de estadísticas
3. Verificar gráfico de ventas por mes
4. Verificar top productos
5. Verificar resumen de inventario

---

## 🐛 Troubleshooting

### Error: "Tu navegador no soporta reconocimiento de voz"

**Causa:** Navegador sin Web Speech API
**Solución:** Usar Chrome o Edge

### Error: "Error al generar el reporte"

**Posibles Causas:**
1. Backend no está corriendo
2. Token JWT expirado
3. Prompt mal formado
4. No hay datos para los filtros

**Solución:**
1. Verificar que backend esté en `http://localhost:8000`
2. Re-login para refrescar token
3. Usar prompts de ejemplo
4. Cambiar período de tiempo

### Analytics no carga

**Causa:** Endpoint `/api/analytics/overview/` falla
**Solución:**
1. Verificar logs del backend
2. Verificar que hay datos en la BD
3. Verificar permisos del usuario

---

## 📝 Tipos TypeScript

### ReportType
```typescript
type ReportType = 'ventas' | 'productos' | 'clientes' | 'analytics';
```

### ReportFormat
```typescript
type ReportFormat = 'pdf' | 'excel' | 'csv';
```

### AnalyticsOverview
```typescript
interface AnalyticsOverview {
  sales_by_month: SalesByMonth[];
  products_by_category: ProductsByCategory[];
  activity_by_day: ActivityByDay[];
  top_selling_products: TopProduct[];
  sales_by_status: SalesByStatus[];
  summary: Summary;
  inventory_summary: InventorySummary;
  customer_analytics: CustomerAnalytics;
}
```

Ver archivo completo: `src/modules/reports/types/index.ts`

---

## 🚀 Roadmap

- [x] Generación de reportes con prompts
- [x] Reconocimiento de voz
- [x] Dashboard de analytics
- [ ] Gráficos con Chart.js o Recharts
- [ ] Reportes programados
- [ ] Filtros avanzados en Analytics
- [ ] Exportar gráficos como imagen
- [ ] Comparación de períodos

---

## 📚 Recursos

- **Backend README**: `ss_backend/apps/reports/README.md`
- **API Docs**: http://localhost:8000/api/docs/
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

---

**Implementado por:** Claude Code Assistant
**Fecha:** Noviembre 2024
**Versión:** 1.0.0
