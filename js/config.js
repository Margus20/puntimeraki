// ==========================================
// CONFIGURACIÓN Y CONSTANTES GLOBALES (PUNTIMERAKI)
// ==========================================

// ✅ CONFIG: Centraliza todos los valores que pueden cambiar con el tiempo
export const CONFIG = {
    TASA_CACHE_KEY: 'puntimeraki_tasa_bcv',
    TASA_TIMESTAMP_KEY: 'puntimeraki_tasa_timestamp',
    HORAS_ACTUALIZACION: 6, // Horas antes de volver a consultar la API
    TASA_RESPALDO: 36.50,   // Tasa de emergencia si la API falla y no hay caché
    API_URL: 'https://ve.dolarapi.com/v1/dolares/oficial' // API confiable y gratuita
};

// ✅ PRODUCTOS: Catálogo maestro. 
// Nota: Los precios deben ser números (ej: 3.50, no "3.50") para que los cálculos matemáticos funcionen.
export const PRODUCTOS = [
    { 
        id: 1, 
        nombre: "Separador Girasoles Dorados", 
        precio: 3.50, 
        categoria: "separadores_de_libro", 
        imagen: "img/separadores_de_libro/amarillo_1.jpg", 
        url: "/puntimeraki/separadores_de_libro/girasoles-dorados.html" // ✅ CAMBIO: Ruta absoluta para que el enlace funcione desde cualquier página
    }
];
