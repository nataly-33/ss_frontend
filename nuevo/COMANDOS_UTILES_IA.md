# 🚀 Comandos Útiles - Sistema de IA

## Activar Entorno Virtual

```powershell
cd ss_backend
.\vane\Scripts\activate
```

---

## Entrenar Modelo

### Entrenamiento básico

```bash
python manage.py train_model
```

### Con parámetros personalizados

```bash
python manage.py train_model --estimators 200 --depth 15 --test-size 0.3
```

**Parámetros**:

- `--estimators N`: Número de árboles (default: 100, rango: 10-500)
- `--depth N`: Profundidad máxima (default: 10, rango: 3-50)
- `--test-size 0.X`: Proporción para testing (default: 0.2)

---

## Servidor de Desarrollo

```bash
python manage.py runserver
```

**URLs importantes**:

- API Docs (Swagger): http://localhost:8000/api/docs/
- Admin: http://localhost:8000/admin/
- Dashboard IA: http://localhost:8000/api/ai/dashboard/

---

## Migraciones

### Si modificas modelos

```bash
python manage.py makemigrations ai
python manage.py migrate ai
```

### Ver estado de migraciones

```bash
python manage.py showmigrations ai
```

---

## Tests

### Ejecutar todos los tests de IA

```bash
python manage.py test apps.ai
```

### Tests específicos

```bash
python manage.py test apps.ai.tests.test_ai.DataPreparationServiceTest
```

### Con verbose

```bash
python manage.py test apps.ai --verbosity=2
```

---

## API con cURL (PowerShell)

### 1. Login (obtener token)

```powershell
curl -X POST http://localhost:8000/api/auth/login/ `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@example.com\", \"password\":\"admin123\"}'
```

**Guarda el token de la respuesta**: `"access": "eyJ0eXAiOiJKV1..."`

### 2. Dashboard IA

```powershell
curl http://localhost:8000/api/ai/dashboard/ `
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 3. Predicción simple

```powershell
curl -X POST http://localhost:8000/api/ai/predictions/sales-forecast/ `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer TU_TOKEN_AQUI" `
  -d '{\"n_months\": 1}'
```

### 4. Predicción por categoría

```powershell
curl -X POST http://localhost:8000/api/ai/predictions/sales-forecast/ `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer TU_TOKEN_AQUI" `
  -d '{\"categoria\": \"Vestidos\", \"n_months\": 3}'
```

### 5. Re-entrenar modelo

```powershell
curl -X POST http://localhost:8000/api/ai/train-model/ `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer TU_TOKEN_AQUI" `
  -d '{\"n_estimators\": 100, \"max_depth\": 10}'
```

### 6. Ver modelo activo

```powershell
curl http://localhost:8000/api/ai/active-model/ `
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 7. Lista de modelos

```powershell
curl http://localhost:8000/api/ai/models/ `
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 8. Historial de predicciones

```powershell
curl "http://localhost:8000/api/ai/predictions/history/?limit=10" `
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## Python Interactivo (Para debugging)

```bash
python manage.py shell
```

```python
# Dentro del shell
from apps.ai.services.data_preparation import DataPreparationService
from apps.ai.services.model_training import ModelTrainingService
from apps.ai.services.prediction import PredictionService

# Obtener datos
data_service = DataPreparationService()
df = data_service.get_historical_sales_data(months_back=12)
print(f"Registros: {len(df)}")

# Ver datos sintéticos
df_synthetic = data_service._generate_synthetic_data(num_months=3, records_per_month=20)
print(df_synthetic.head())

# Entrenar modelo
training_service = ModelTrainingService()
result = training_service.train_model(n_estimators=50, max_depth=5)
print(f"R² Score: {result['metrics']['test']['r2']}")

# Hacer predicción
prediction_service = PredictionService()
pred = prediction_service.predict_next_month()
print(f"Predicción: {pred}")
```

---

## Admin de Django

### Crear superusuario (si no existe)

```bash
python manage.py createsuperuser
```

### Acceder

1. Ve a: http://localhost:8000/admin/
2. Login con credenciales de superuser
3. Navega a "ML Models" o "Predicción de Ventas"

---

## Verificar Estado del Sistema

### Ver modelos entrenados

```bash
python manage.py shell -c "from apps.ai.models import MLModel; print(MLModel.objects.all())"
```

### Ver modelo activo

```bash
python manage.py shell -c "from apps.ai.models import MLModel; print(MLModel.objects.filter(activo=True).first())"
```

### Ver predicciones recientes

```bash
python manage.py shell -c "from apps.ai.models import PrediccionVentas; print(PrediccionVentas.objects.all()[:5])"
```

---

## Limpiar Datos (Cuidado!)

### Eliminar todos los modelos

```bash
python manage.py shell -c "from apps.ai.models import MLModel; MLModel.objects.all().delete()"
```

### Eliminar todas las predicciones

```bash
python manage.py shell -c "from apps.ai.models import PrediccionVentas; PrediccionVentas.objects.all().delete()"
```

---

## Logs y Debugging

### Ver logs del servidor

El servidor muestra logs en la consola donde ejecutaste `runserver`

### Ver queries SQL

En `settings/base.py`, agrega:

```python
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

---

## Instalación de Dependencias (Si faltan)

```bash
pip install scikit-learn==1.3.2 pandas==2.1.4 numpy==1.26.2 joblib==1.3.2
```

---

## Archivos de Modelos

Los modelos se guardan en:

```
ss_backend/models/ventas_predictor_v1.0_YYYYMMDD_HHMMSS.pkl
```

### Ver modelos guardados

```powershell
dir models\*.pkl
```

### Tamaño del modelo

```powershell
Get-ChildItem models\*.pkl | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB, 2)}}
```

---

## Exportar Datos

### Exportar predicciones a CSV

```python
# En manage.py shell
from apps.ai.models import PrediccionVentas
import pandas as pd

preds = PrediccionVentas.objects.all().values('periodo_predicho', 'ventas_predichas', 'categoria', 'fecha_prediccion')
df = pd.DataFrame(list(preds))
df.to_csv('predicciones_export.csv', index=False)
```

---

## Swagger UI (Más fácil que cURL)

1. Abre: http://localhost:8000/api/docs/
2. Haz click en "Authorize" (arriba a la derecha)
3. Ingresa el token: `Bearer TU_TOKEN_AQUI`
4. Ahora puedes probar todos los endpoints con clicks

---

## Troubleshooting Rápido

### Error: "No module named 'sklearn'"

```bash
pip install scikit-learn pandas numpy joblib
```

### Error: "No such table: apps_ai_mlmodel"

```bash
python manage.py migrate ai
```

### Error: "No hay modelo activo"

```bash
python manage.py train_model
```

### Servidor no arranca (puerto ocupado)

```bash
python manage.py runserver 8001
```

### Cambiar puerto

```bash
python manage.py runserver 0.0.0.0:8080
```

---

## Comandos para Presentación

### Demo rápida (3 comandos)

```bash
# 1. Entrenar modelo
python manage.py train_model

# 2. Ver en Swagger
start http://localhost:8000/api/docs/

# 3. Dashboard
curl http://localhost:8000/api/ai/dashboard/ -H "Authorization: Bearer TOKEN"
```

---

## Alias Útiles (Opcional)

Agrega a tu perfil de PowerShell (`notepad $PROFILE`):

```powershell
function ai-train {
    cd D:\1NATALY\Proyectos\smart_sales\ss_backend
    .\vane\Scripts\activate
    python manage.py train_model
}

function ai-server {
    cd D:\1NATALY\Proyectos\smart_sales\ss_backend
    .\vane\Scripts\activate
    python manage.py runserver
}

function ai-docs {
    start http://localhost:8000/api/docs/
}
```

Luego solo escribe:

```bash
ai-train    # Entrena modelo
ai-server   # Inicia servidor
ai-docs     # Abre documentación
```

---

**Guarda este archivo para referencia rápida!** 📌
