# Smart Sales — Frontend (React + TypeScript + Vite)

Frontend del proyecto SmartSales365: aplicación web en React + TypeScript construida con Vite y Tailwind CSS. Esta repo contiene la UI pública que consume la API del backend (Django REST).

Principales tecnologías:

- React 18 + TypeScript
- Vite (dev + build)
- Tailwind CSS
- ESLint + Prettier (configuración inicial)

## Características

- Páginas de autenticación (Login/Register)
- Catálogo de productos (listado, filtros, detalle)
- Carrito y checkout
- Páginas de pedidos y perfil de cliente
- Componentes compartidos (Navbar, Footer, UI primitives)

## Requisitos

- Node.js 18+ (o LTS recomendada)
- npm o yarn

## Primeros pasos (desarrollo)

Desde la raíz del frontend:

```powershell
# instalar dependencias
npm install

# modo desarrollo (HMR)
npm run dev

# build de producción
npm run build

# preview del build (opcional)
npm run preview
```

## Variables de entorno

No agregues tu archivo `.env` en el repositorio. Usa `.env.example` como plantilla. Variables relevantes:

- VITE_API_URL — URL base de la API (ej: http://localhost:8000/api)
- VITE_APP_NAME — Nombre de la app para mostrar

Ejemplo:

```powershell
cp .env.example .env
# editar .env con tus valores locales
```

## Estructura del proyecto (resumen)

```
public/                # assets estáticos (logos, imágenes públicas)
src/
  ├─ assets/            # imágenes, íconos
  ├─ core/              # configuración central (api, routes, store, theme)
  ├─ modules/           # features por dominio (auth, products, cart, orders...)
  └─ shared/            # componentes y utilidades compartidas
```

## Scripts útiles (package.json)

- npm run dev — iniciar servidor de desarrollo
- npm run build — generar build de producción
- npm run preview — servir build en local
- npm run lint — correr ESLint

## Contribuyendo

Sigue la guía de contribución del repo raíz. Breve resumen:

- Crea una rama basada en `dev` (o `main` si no hay `dev`): `feature/<nombre>`
- Usa commits convencionales: `feat(scope): descripción corta` / `fix(scope): ...` / `docs: ...`
- Divide cambios en commits pequeños y enfocados

## Deploy

El frontend puede desplegarse como una SPA estática (Vercel, Netlify, S3+CloudFront). Asegúrate de configurar `VITE_API_URL` en el entorno de producción.

## Enlaces y recursos

- Backend (API): apunta a la URL donde desplegues el backend Django
- Documentación del proyecto: revisa `RESUMEN_COMPLETO.md` y `CONTRIBUTING.md` en la raíz

## Contacto

Si tienes dudas sobre la estructura o el flujo de trabajo, revisa `CONTRIBUTING.md` o pregunta en el canal del equipo.

---

Archivo generado/actualizado automáticamente para alinear el README del frontend con el estilo del backend.
