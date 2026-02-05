# 🚀 Kallpa Frontend - Azure Deployment Guide

## 📋 Resumen del Proyecto

**Frontend:** Next.js 15 + TypeScript + Tailwind CSS (NextAdmin Template)  
**Backend:** Flask API en Azure App Service  
**Base de Datos:** PostgreSQL (Neon)  
**Hosting:** Azure App Service + GitHub Actions CI/CD

---

## 🌐 URLs de Producción

- **Frontend:** `https://kallpa-frontend-app.azurewebsites.net`
- **Backend:** `https://kallpa-backend-app.azurewebsites.net`
- **Health Check:** `https://kallpa-frontend-app.azurewebsites.net/health`

---

## ⚡ Configuración Azure App Service

### 🔧 Variables de Entorno Requeridas

```bash
# En Azure App Service Configuration
NEXT_PUBLIC_API_URL=https://kallpa-backend-app.azurewebsites.net
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_OUTPUT_STANDALONE=true
WEBSITES_PORT=3000
WEBSITE_NODE_DEFAULT_VERSION=~20
```

### 🏗️ Configuración del App Service

```json
{
  "name": "kallpa-frontend-app",
  "runtime": "node:20-lts",
  "os": "linux",
  "sku": "F1 o superior",
  "healthCheckPath": "/health"
}
```

---

## 🚀 Despliegue con GitHub Actions

### 📋 Pre-requisitos

1. **Azure App Service creado** con las variables de entorno configuradas
2. **GitHub Secrets configurados:**
   ```
   AZURE_WEBAPP_PUBLISH_PROFILE = [contenido del archivo .publishsettings]
   ```

### 🔄 Pipeline Automático

El pipeline se ejecuta automáticamente en:
- ✅ Push a `main`
- ✅ Push a `develop`
- ✅ Ejecución manual

#### Fases del Pipeline:

1. **🔨 Build & Test**
   - Instala dependencias
   - Ejecuta linter
   - Construye aplicación
   - Sube artefactos

2. **🌐 Deploy Azure**
   - Descarga artefactos
   - Despliega a Azure App Service

3. **🩺 Health Check**
   - Verifica estado de aplicación
   - Prueba conectividad con backend

---

## 🏃‍♂️ Comandos de Desarrollo

```bash
# 📦 Instalar dependencias
npm install

# 🔥 Desarrollo local
npm run dev

# 🏗️ Build de producción
npm run build

# 🚀 Iniciar producción local
npm start

# 🔍 Linter
npm run lint
```

---

## 🧪 Testing Local

### Probar Build de Producción:
```bash
# 1. Build
NEXT_PUBLIC_API_URL=https://kallpa-backend-app.azurewebsites.net npm run build

# 2. Start
npm start

# 3. Test health
curl http://localhost:3000/health
```

### Probar Conectividad Backend:
```bash
curl https://kallpa-backend-app.azurewebsites.net/health
```

---

## 📊 Monitoreo y Debugging

### Health Check Endpoint:
```
GET /health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-05T...",
  "version": "1.2.1",
  "environment": "production",
  "backend": {
    "url": "https://kallpa-backend-app.azurewebsites.net",
    "status": "healthy",
    "responseTime": "150ms"
  }
}
```

### Logs en Azure:
```bash
# Via Azure CLI
az webapp log tail --name kallpa-frontend-app --resource-group kallpa-rg

# Via Portal Azure
App Service → Monitoring → Log stream
```

---

## 🔧 Configuración API Client

El cliente API está configurado en `/src/lib/api.ts` con:

- ✅ **Auto-retry** con backoff exponencial
- ✅ **Timeout** de 30 segundos
- ✅ **Interceptores** para auth y errores
- ✅ **Manejo de tokens** automático
- ✅ **Health checks** integrados

```typescript
import { api } from '@/lib/api';

// Uso básico
const data = await api.get('/endpoint');
const result = await api.post('/endpoint', payload);
```

---

## 🛡️ Seguridad

### Headers de Seguridad (Automáticos):
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: origin-when-cross-origin`

### Variables de Entorno:
- ✅ `NEXT_PUBLIC_*` expuestas al cliente
- ✅ Otras variables server-side only
- ✅ Secrets en GitHub Secrets

---

## 🔄 Rollback Strategy

```bash
# Via Azure Portal
App Service → Deployment Center → Redeploy previous version

# Via GitHub Actions
Actions → Re-run previous successful workflow
```

---

## 🆘 Troubleshooting

### Problema: "Cannot connect to server"
```bash
# 1. Verificar backend
curl https://kallpa-backend-app.azurewebsites.net/health

# 2. Verificar variables de entorno
echo $NEXT_PUBLIC_API_URL

# 3. Verificar logs
az webapp log tail --name kallpa-frontend-app --resource-group kallpa-rg
```

### Problema: Build failures
```bash
# 1. Verificar Node version
node --version  # Should be 20.x

# 2. Clean install
rm -rf node_modules package-lock.json
npm install

# 3. Test build locally
npm run build
```

### Problema: Health check fails
- Verificar que la aplicación responda en puerto 3000
- Verificar que `/health` endpoint esté accesible
- Revisar logs de Azure App Service

---

## 📞 Contacto

**DevOps Team:** [email]  
**Docs:** [link]  
**Monitoring:** Azure Portal → kallpa-frontend-app