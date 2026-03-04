# ⚡ Guía Rápida: Configuración del Webhook

## Paso 1: Obtener tu URL de Webhook

### Opción A: Webhook.site (Recomendado - Gratuito)
1. Ve a [https://webhook.site](https://webhook.site)
2. Se genera automáticamente una URL única: `https://webhook.site/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`
3. **Copia la URL completa**

### Opción B: RequestBin (Alternativa)
1. Ve a [https://requestbin.com](https://requestbin.com)
2. Haz clic en "Create a RequestBin"
3. Copia la URL generada

---

## Paso 2: Configurar analytics.js

Abre el archivo `analytics.js` y busca la línea 11:

```javascript
webhookUrl: 'https://webhook.site/your-unique-id', // REEMPLAZAR
```

**Reemplázala por tu URL real:**

```javascript
webhookUrl: 'https://webhook.site/abc123-def456-ghi789', // ✅ Tu URL
```

---

## Paso 3: Probar

1. Abre `index.html` en tu navegador
2. Ve a tu panel de Webhook.site
3. **Verás aparecer los requests en tiempo real**

---

## 📊 Qué verás en Webhook.site

### Request 1 - Carga de página (siempre)
```
POST https://webhook.site/tu-id
Content-Type: application/json

{
  "event": "page_load",
  "sessionId": "session_...",
  "networkInfo": {
    "ip": "181.45.123.45",
    "isp": "Telecom Argentina S.A.",
    ...
  }
}
```

### Request 2 - Si deniega GPS
```
{
  "event": "gps_denied",
  "errorType": "PERMISSION_DENIED"
}
```

### Request 3 - Si acepta GPS
```
{
  "event": "gps_granted",
  "gpsData": {
    "latitude": -27.4912,
    "longitude": -55.1183
  }
}
```

---

## 🔍 Tips

- **Session ID vincula los 3 requests** de un mismo usuario
- Los datos se envían **aunque el usuario cierre la página**
- Webhook.site **guarda los logs por 7 días**
- Puedes ver headers, IP origen, y timestamp de cada request

---

## 🚨 Importante

⚠️ **NO compartas tu URL de webhook públicamente** - cualquiera puede enviar datos a ella

⚠️ Para producción, usa un backend propio con autenticación o Firebase

---

## ✅ Listo para producción

Si quieres guardar los datos permanentemente, cambia a Firebase siguiendo la guía del README.md principal.
