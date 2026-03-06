# 📱 GUÍA: Notificaciones por Telegram Bot

## 🎯 Lo Que Recibirás

Cada vez que alguien acepta GPS, te llega **notificación instantánea** a tu Telegram:

```
🤖 Oberá Analytics Bot

🔴 Nueva ubicación GPS
━━━━━━━━━━━━━━━━━━━━

📅 Fecha: 04/03/2026 - 16:45:22

🌐 INFORMACIÓN DE RED
━━━━━━━━━━━━━━━━━━━━
🔹 IP: 181.45.123.45
🔹 ISP: Telecom Argentina S.A.
🔹 Ciudad: Oberá
🔹 Dispositivo: Samsung Galaxy

✅ GPS ACEPTADO
━━━━━━━━━━━━━━━━━━━━
📍 Lat: -27.4912345
📍 Lng: -55.1183678
📏 Precisión: 18.5 metros

🗺️ Ver en Google Maps (click para abrir)

[También envía mapa interactivo ▼]
```

---

## ⚡ Ventajas de Telegram

| Feature | Email | Telegram |
|---------|-------|----------|
| **Velocidad** | 5-30 segundos | **1 segundo** |
| **Notificación** | Silenciosa | **Push + sonido** |
| **Mapa interactivo** | ❌ Solo link | **✅ Pin en mapa** |
| **Celular bloqueado** | ❌ No ves | **✅ Notificación** |
| **Acceso rápido** | Abrir Gmail | **Notificación directa** |

---

## 📋 Configuración en 7 Pasos

### 1️⃣ Crear Tu Bot de Telegram

1. **Abre Telegram** en tu celular
2. **Busca:** `@BotFather`
3. **Envía:** `/newbot`
4. **Nombre del bot:** `Oberá Analytics Bot`
5. **Username:** `obera_analytics_bot` (debe terminar en `_bot`)
6. **COPIAR el Token** que te da (algo como):
   ```
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz123456789
   ```

---

### 2️⃣ Obtener Tu Chat ID

**Opción A: Usando otro bot**
1. Busca en Telegram: `@userinfobot`
2. Envíale `/start`
3. Te responde con tu **Chat ID** (número como `123456789`)

**Opción B: Método manual**
1. Abre tu bot recién creado
2. Envíale `/start`
3. Ve a esta URL en tu navegador (reemplaza TOKEN):
   ```
   https://api.telegram.org/botTOKEN/getUpdates
   ```
4. Busca el número después de `"chat":{"id":`

---

### 3️⃣ Configurar el Script

1. **Ve a:** https://script.google.com
2. **Nuevo proyecto**
3. **Copia el código** de `telegram-bot-script.gs`
4. **Edita líneas 10-11:**
   ```javascript
   botToken: '1234567890:ABCdefGHI...', // Tu token de BotFather
   chatId: '123456789',                  // Tu Chat ID
   ```
5. **Guarda:** 💾 Nombre: "Telegram Notifier"

---

### 4️⃣ Probar el Bot

1. En el menú desplegable arriba: **`testTelegram`**
2. Click **Ejecutar** ▶️
3. Primera vez: **Permitir permisos**
4. **Revisa Telegram** → Deberías recibir:
   ```
   ✅ Test Oberá Analytics
   
   Si recibes este mensaje, el bot está 
   configurado correctamente.
   
   🚀 Listo para recibir notificaciones
   ```

---

### 5️⃣ Implementar como Webhook

1. Click **"Implementar"** → **"Nueva implementación"**
2. Ícono ⚙️ → **"Aplicación web"**
3. Configuración:
   - Ejecutar como: **Yo**
   - Acceso: **Cualquier persona**
4. Click **"Implementar"**
5. **COPIAR la URL** (termina en `/exec`)

---

### 6️⃣ Actualizar analytics.js

**Opción A:** Pásame la URL y lo actualizo yo

**Opción B:** Edita en GitHub:
```javascript
// analytics.js línea 15
googleScriptUrl: 'https://script.google.com/macros/s/TU-URL.../exec',
```

---

### 7️⃣ ¡Probar!

1. **Entra a tu sitio** en modo incógnito
2. **Acepta GPS**
3. **Mira tu Telegram** → ¡Debería llegar la notificación! 🎉

---

## 📱 Mapa Interactivo en Telegram

El bot envía **2 mensajes**:

**Mensaje 1:** Texto con toda la info
**Mensaje 2:** 📍 Pin en mapa interactivo de Telegram

**Click en el pin →** Se abre Google Maps o la app de mapas de tu celular

---

## 🔧 Configuración Avanzada (Opcional)

### Recibir Notificación de TODO

En el script, línea 12:
```javascript
notificarSinGPS: true, // Notifica aunque rechacen GPS
```

**Recibirás 3 tipos de mensajes:**
- 🌐 Visita (sin GPS aún)
- ✅ GPS Aceptado
- ❌ GPS Rechazado

---

## ✅ Recomendación Final

**USA TELEGRAM + GOOGLE SHEETS:**

| Herramienta | Para Qué |
|-------------|----------|
| **Telegram** | Notificaciones instantáneas al celular |
| **Google Sheets** | Base de datos permanente (histórico) |

**Elimina:**
- ❌ Webhook.site (solo 7 días, ya no necesario)
- ❌ Email (más lento que Telegram)

---

## 🚀 ¿Listo?

**Sigue los 7 pasos arriba** y en 10 minutos tendrás notificaciones instantáneas en tu Telegram.

**¿Quieres que te ayude paso a paso?** Dime cuando tengas:
1. ✅ Bot Token (de BotFather)
2. ✅ Chat ID (de @userinfobot)

Y yo configuro todo 🤖📱
