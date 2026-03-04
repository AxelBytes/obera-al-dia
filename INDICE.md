# 📚 Índice del Proyecto - Oberá Al Día

## 🎯 Archivos Principales

### 1. **index.html**
- Landing page principal del sitio de noticias
- Incluye modal de verificación de residencia
- Diseño responsivo con Tailwind CSS
- Header rojo/blanco, sección "Último Momento", grilla de noticias

### 2. **analytics.js**
- Sistema de captura en dos fases (IP/ISP + GPS)
- Modal bloqueante persistente
- Envío a webhook o Firebase
- Session ID para vinculación de paquetes
- **⚠️ ARCHIVO CLAVE DEL SISTEMA**

### 3. **testing.html**
- Panel de testing interactivo
- Ver estado en tiempo real
- Botones de control (reintentar, mostrar/ocultar modal)
- Logs visuales del sistema

---

## 📖 Documentación

### 4. **README.md**
- Documentación completa del proyecto
- Guía de configuración de webhook y Firebase
- Ejemplos de datos capturados
- Instrucciones de testing
- Características técnicas

### 5. **CONFIGURACION-WEBHOOK.md**
- Guía rápida de setup
- Paso a paso para Webhook.site
- Qué verás en el panel del webhook
- Tips y warnings

### 6. **DIAGRAMA-FLUJO.md**
- Flujo visual completo del sistema
- Casos de uso (acepta/deniega/reintenta)
- Explicación de paquetes de datos
- Vinculación por Session ID

### 7. **RESUMEN.md**
- Resumen ejecutivo del proyecto
- Objetivo completado
- Configuración en 3 pasos
- Datos capturados
- Personalización

### 8. **CONSIDERACIONES-LEGALES.md**
- ⚖️ Marco legal en Argentina (Ley 25.326)
- 🌍 GDPR (Europa) y CCPA (California)
- 🛡️ Recomendaciones de cumplimiento
- 🎭 Ética y transparencia
- ✅ Checklist pre-producción
- **⚠️ LECTURA OBLIGATORIA ANTES DE PRODUCCIÓN**

---

## 📊 Ejemplos y Referencias

### 9. **ejemplo-datos-capturados.json**
- Ejemplo del Paquete 1 (IP/ISP)
- Ejemplo del Paquete 2 (GPS aceptado)
- Ejemplo de evento de rechazo
- Formato JSON real

### 10. **INDICE.md** (este archivo)
- Índice completo del proyecto
- Navegación entre archivos

---

## 🚀 Flujo de Trabajo Recomendado

### Para empezar rápido:
1. Lee **RESUMEN.md** (5 minutos)
2. Sigue **CONFIGURACION-WEBHOOK.md** (2 minutos)
3. Abre `index.html` en el navegador
4. Ve los datos en webhook.site

### Para entender el sistema:
1. Lee **README.md** (10 minutos)
2. Revisa **DIAGRAMA-FLUJO.md** (5 minutos)
3. Abre **testing.html** para experimentar
4. Inspecciona `analytics.js` (código comentado)

### Antes de producción:
1. ⚠️ Lee **CONSIDERACIONES-LEGALES.md** (15 minutos)
2. Consulta con abogado
3. Implementa política de privacidad
4. Cambia webhook por backend seguro
5. Agrega consentimiento de cookies

---

## 🗂️ Estructura de Directorios

```
page vic/
├── index.html                      # Página principal
├── analytics.js                    # Script de captura
├── testing.html                    # Panel de testing
├── README.md                       # Documentación principal
├── CONFIGURACION-WEBHOOK.md        # Setup rápido
├── DIAGRAMA-FLUJO.md              # Flujo visual
├── RESUMEN.md                      # Resumen ejecutivo
├── CONSIDERACIONES-LEGALES.md      # Aspectos legales
├── ejemplo-datos-capturados.json  # Ejemplo de datos
└── INDICE.md                       # Este archivo
```

---

## 🔍 Búsqueda Rápida

### ¿Cómo configurar el webhook?
→ **CONFIGURACION-WEBHOOK.md** (líneas 5-20)

### ¿Qué datos se capturan?
→ **README.md** (sección "Sistema de Analytics Persistente")
→ **ejemplo-datos-capturados.json**

### ¿Cómo funciona el modal?
→ **DIAGRAMA-FLUJO.md** (sección "Casos de uso")
→ **index.html** (líneas 87-138)

### ¿Es legal este sistema?
→ **CONSIDERACIONES-LEGALES.md** (⚠️ COMPLETO)

### ¿Cómo testear el sistema?
→ **testing.html** (abrir en navegador)
→ **README.md** (sección "Testing del Sistema Persistente")

### ¿Dónde está el código del modal?
→ **index.html** (CSS: líneas 35-82, HTML: líneas 87-138)
→ **analytics.js** (funciones showLocationModal/hideLocationModal)

### ¿Dónde se envían los datos?
→ **analytics.js** (función sendToWebhook, línea 13 para configurar)

### ¿Cómo cambiar a Firebase?
→ **README.md** (sección "Opción 2: Firebase Firestore")

---

## 📞 Soporte

### Problemas comunes

**"No se captura la IP"**
→ Verifica conexión a internet
→ Revisa consola (F12) para errores

**"El modal no aparece"**
→ Verifica que analytics.js esté cargado
→ Resetea permisos de ubicación del navegador

**"Los datos no llegan al webhook"**
→ Verifica que la URL en analytics.js (línea 13) sea correcta
→ Revisa CORS en la consola

**"El GPS siempre falla"**
→ Usa HTTPS (geolocalización requiere conexión segura)
→ Prueba en exterior (GPS funciona mejor fuera de edificios)

---

## 🎓 Recursos Adicionales

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Geolocation API MDN](https://developer.mozilla.org/es/docs/Web/API/Geolocation_API)
- [Webhook.site Docs](https://docs.webhook.site/)
- [Firebase Docs](https://firebase.google.com/docs)

---

## ✅ Checklist de Instalación

- [ ] Descargar/clonar todos los archivos
- [ ] Leer RESUMEN.md
- [ ] Configurar URL de webhook en analytics.js
- [ ] Abrir index.html en navegador
- [ ] Verificar que los datos lleguen al webhook
- [ ] Probar aceptar/denegar GPS
- [ ] Revisar testing.html
- [ ] ⚠️ Leer CONSIDERACIONES-LEGALES.md antes de producción

---

**Última actualización:** 4 de marzo de 2026  
**Versión:** 1.0.0  
**Autor:** Sistema de Analytics Persistente para Oberá Al Día
