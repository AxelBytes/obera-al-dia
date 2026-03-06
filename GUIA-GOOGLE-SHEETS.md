# 📊 GUÍA: Google Sheets - Base de Datos Ilimitada

## 🎯 Con Esta Opción Tendrás

✅ **Tabla ordenada** como Excel  
✅ **Gratis e ilimitado** (hasta 10 millones de celdas)  
✅ **Accesible desde celular** (app Google Sheets)  
✅ **Búsquedas y filtros** fáciles  
✅ **Exportar a Excel/CSV** cuando quieras  
✅ **Permanente** (nunca se borra)

---

## 📋 Configuración en 6 Pasos

### 1️⃣ Crear Google Sheet

1. Ve a: **https://sheets.google.com**
2. Click en **"+"** (Hoja de cálculo en blanco)
3. Nombre: **"Oberá Analytics"**
4. Deja la hoja abierta

---

### 2️⃣ Abrir Editor de Scripts

1. En tu Google Sheet, click en **Extensiones** → **Apps Script**
2. Se abre una nueva pestaña
3. **Borra todo** el código por defecto

---

### 3️⃣ Pegar el Script

1. **Copia TODO** el código del archivo: `google-sheets-script.gs`
2. **Pégalo** en Apps Script
3. **Guarda:** Click en 💾
4. Nombre: "Oberá Sheets Handler"

---

### 4️⃣ Implementar como Web App

1. Click en **"Implementar"** (arriba derecha)
2. **"Nueva implementación"**
3. Click ícono **⚙️** → **"Aplicación web"**
4. Configuración:
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier persona
5. Click **"Implementar"**
6. **COPIAR LA URL** (termina en `/exec`)

---

### 5️⃣ Configurar en analytics.js

**Opción A:** Pásame la URL y lo configuro yo

**Opción B:** Edita en GitHub:
```javascript
// Línea 15 de analytics.js
googleScriptUrl: 'https://script.google.com/macros/s/TU-URL.../exec',
```

---

### 6️⃣ ¡Listo! Ver los Datos

**Desde cualquier lugar:**
1. Abre Google Sheets en tu celular/PC
2. Busca: "Oberá Analytics"
3. Verás la tabla actualizándose en tiempo real

---

## 📊 Cómo Se Verá

```
┌──────────┬─────────┬──────────────┬──────────────┬────────────┬──────────┬────────┬──────────┬──────────┬──────────┐
│  Fecha   │  Hora   │    Evento    │  Session ID  │     IP     │   ISP    │ Ciudad │ Latitud  │ Longitud │   Mapa   │
├──────────┼─────────┼──────────────┼──────────────┼────────────┼──────────┼────────┼──────────┼──────────┼──────────┤
│ 04/03/26 │ 16:45   │ ✅ GPS       │ session_123  │ 181.45...  │ Telecom  │ Oberá  │ -27.4912 │ -55.1183 │ [Ver]    │
│ 04/03/26 │ 17:20   │ ✅ GPS       │ session_456  │ 190.12...  │ Personal │ Posadas│ -27.3671 │ -55.8969 │ [Ver]    │
│ 04/03/26 │ 18:05   │ ❌ Rechazó   │ session_789  │ 200.45...  │ Claro    │ Oberá  │          │          │          │
└──────────┴─────────┴──────────────┴──────────────┴────────────┴──────────┴────────┴──────────┴──────────┴──────────┘
```

**Colores:**
- 🟢 **Verde:** GPS aceptado
- 🔴 **Rojo:** GPS rechazado
- ⚪ **Blanco:** Solo carga de página

---

## 📱 Desde Tu Celular

1. **Descarga** app Google Sheets (Play Store/App Store)
2. **Abre** "Oberá Analytics"
3. **Ve en tiempo real** cada entrada nueva
4. **Click en link de Mapa** → Se abre Google Maps con la ubicación exacta

---

## 🔍 Funciones Útiles

### Buscar por Ciudad
1. Click en **Datos** → **Filtros**
2. Click en columna "Ciudad"
3. Marca solo "Oberá" (o la ciudad que quieras)

### Contar Cuántos Aceptaron GPS
```
=COUNTIF(C:C,"✅ GPS Aceptado")
```

### Exportar a Excel
1. **Archivo** → **Descargar** → **Microsoft Excel (.xlsx)**

---

## ✅ Ventajas vs Webhook.site

| Feature | Webhook.site | Google Sheets |
|---------|--------------|---------------|
| **Límite de datos** | 7 días | ♾️ Ilimitado |
| **Formato** | JSON texto | Tabla ordenada |
| **Búsquedas** | ❌ Limitado | ✅ Filtros avanzados |
| **Acceso móvil** | ✅ Web | ✅ App nativa |
| **Exportar** | ❌ Solo JSON | ✅ Excel, CSV, PDF |
| **Costo** | Gratis | Gratis |

---

## 🎯 Recomendación

**USA AMBOS:**
- ✅ **Google Sheets:** Base de datos permanente
- ✅ **Email (ya configurado):** Notificaciones instantáneas

**Elimina webhook.site si quieres** (ya no lo necesitas)

---

## 🚀 ¿Listo para Configurar?

**Dime:**
1. ¿Quieres que reemplace webhook.site por Google Sheets?
2. ¿O quieres usar AMBOS (Sheets + Email)?

**Paso 1:** Crea el Google Sheet
**Paso 2:** Pégame la URL del script
**Paso 3:** Yo configuro todo

¿Empezamos? 📊
