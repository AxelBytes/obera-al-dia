# 🔄 Diagrama de Flujo del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│  👤 Usuario abre index.html                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  🌐 FASE 1: CAPTURA SILENCIOSA (automática, NO requiere permiso)│
│                                                                   │
│  ✅ Obtiene IP pública                                           │
│  ✅ Obtiene ISP (Proveedor de Internet)                          │
│  ✅ Obtiene ubicación aproximada (ciudad/región)                 │
│  ✅ Obtiene tipo de dispositivo y navegador                      │
│                                                                   │
│  📤 ENVÍA PAQUETE 1 al webhook → event: "page_load"             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  📍 FASE 2: SOLICITUD GPS (requiere permiso del navegador)      │
│                                                                   │
│  El navegador muestra prompt nativo:                             │
│  "¿Permitir que este sitio acceda a tu ubicación?"              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │
        ┌────────────────┴────────────────┐
        │                                  │
        ▼ Acepta                           ▼ Deniega
        │                                  │
┌───────┴──────────┐          ┌───────────┴────────────────┐
│  ✅ GPS ACEPTADO  │          │  ❌ GPS DENEGADO            │
└───────┬──────────┘          └───────────┬────────────────┘
        │                                  │
        │                                  ▼
        │                     ┌────────────────────────────┐
        │                     │  📤 ENVÍA evento:          │
        │                     │  "gps_denied"              │
        │                     └────────────┬───────────────┘
        │                                  │
        │                                  ▼
        │                     ┌────────────────────────────┐
        │                     │  🚨 MODAL BLOQUEANTE       │
        │                     │                            │
        │                     │  [Verificación de          │
        │                     │   Residencia]              │
        │                     │                            │
        │                     │  Contenido difuminado      │
        │                     │  Scroll bloqueado          │
        │                     │                            │
        │                     │  [🔒 Confirmar y Leer]     │
        │                     └────────────┬───────────────┘
        │                                  │
        │                                  │ Usuario hace clic
        │                                  │
        │                                  ▼
        │                     ┌────────────────────────────┐
        │                     │  Vuelve a solicitar GPS    │
        │                     └────────────┬───────────────┘
        │                                  │
        │                     ┌────────────┴──────────┐
        │                     │                       │
        │                     ▼ Acepta               ▼ Deniega
        │                     │                       │
        ▼                     │                       ▼
┌───────────────────┐        │          ┌─────────────────────────┐
│  Captura GPS:      │        │          │  Botón cambia a:        │
│  - Latitud         │◄───────┘          │  "❌ Permiso denegado - │
│  - Longitud        │                   │   Reintentar"           │
│  - Accuracy        │                   │                         │
│  - Altitude        │                   │  Usuario puede          │
│  - Timestamp       │                   │  reintentar infinito    │
└───────┬───────────┘                   └─────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│  📤 ENVÍA PAQUETE 2 → event: "gps_granted"│
│                                           │
│  Incluye:                                 │
│  - Coordenadas GPS precisas               │
│  - Session ID (vincula con Paquete 1)    │
│  - Timestamp                              │
└───────────────┬───────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  ✅ MODAL SE OCULTA                      │
│  ✅ Usuario puede leer libremente        │
└─────────────────────────────────────────┘
```

---

## 📊 Datos enviados en cada fase

### Paquete 1 (SIEMPRE se envía)
- **Evento:** `page_load`
- **Cuándo:** Al cargar la página
- **Requiere permiso:** NO
- **Contenido:**
  - Session ID único
  - IP + ISP + ASN
  - Ciudad/región aproximada (por IP)
  - Tipo de dispositivo
  - Info del navegador
  - Referrer

### Paquete 2 (solo si acepta GPS)
- **Evento:** `gps_granted`
- **Cuándo:** Usuario acepta geolocalización
- **Requiere permiso:** SÍ
- **Contenido:**
  - Coordenadas GPS precisas
  - Accuracy (metros)
  - Altitude, heading, speed
  - Session ID (mismo que Paquete 1)

### Evento de rechazo (si deniega)
- **Evento:** `gps_denied`
- **Cuándo:** Usuario rechaza GPS
- **Contenido:**
  - Error type: `PERMISSION_DENIED`
  - Error message
  - Session ID

---

## 🔗 Vinculación de datos

Todos los paquetes de un mismo usuario se vinculan mediante el **Session ID**:

```json
{
  "sessionId": "session_1709574645123_abc123xyz"
}
```

Esto permite:
- ✅ Saber qué usuario aceptó/rechazó GPS
- ✅ Vincular IP/ISP con coordenadas GPS
- ✅ Analizar tiempo entre carga y aceptación
- ✅ Detectar usuarios que rechazan múltiples veces

---

## 🎯 Casos de uso

### Caso A: Usuario honesto (acepta inmediato)
```
1. Paquete page_load → 10:30:00
2. Paquete gps_granted → 10:30:02
   ✅ Sin modal, lectura libre
```

### Caso B: Usuario dudoso (deniega inicial)
```
1. Paquete page_load → 10:30:00
2. Evento gps_denied → 10:30:02
3. [Modal bloqueante aparece]
4. Usuario hace clic a los 10 segundos
5. Paquete gps_granted → 10:30:12
   ✅ Modal desaparece
```

### Caso C: Usuario persistente en denegar
```
1. Paquete page_load → 10:30:00
2. Evento gps_denied → 10:30:02
3. [Modal bloqueante aparece]
4. Usuario hace clic y vuelve a denegar
5. [Modal sigue visible]
   ❌ No puede leer noticias
```

---

## 💡 Ventajas del sistema

✅ **Captura garantizada de IP/ISP** aunque el usuario nunca acepte GPS
✅ **Modal persistente** impide lectura sin verificación
✅ **No invasivo** si el usuario acepta de inmediato
✅ **Trazabilidad completa** con Session ID
✅ **Reintentos ilimitados** para dar oportunidad al usuario
