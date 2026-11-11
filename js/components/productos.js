// ==========================================
// RENDERIZADO DE PRODUCTOS
// ==========================================

import { formatearConPuntosDeMil, redondearBolivares } from '../utils/helpers.js';

export function renderizarProductos(listaProductos, tasaCambio) {
    const gridProductos = document.getElementById("productos-grid");
    if (!gridProductos) return;
    
    console.log('[PRODUCTOS]: Iniciando renderizado...');
    gridProductos.innerHTML = "";

    if (listaProductos.length === 0) {
        // CORRECCION: Se agrego el backtick de cierre que faltaba
        gridProductos.innerHTML = `<p style="text-align: center; color: var(--chocolate); padding: var(--espacio-lg);">No hay productos en esta categoria por ahora.</p>`;
        return;
    }
    
    const path = window.location.pathname;
    // ✅ CAMBIO QUIRÚRGICO: Actualizar a TODAS las nuevas carpetas de Puntimeraki
    const isSubfolder = path.includes('/portavelas/') || path.includes('/marcalibros/') || path.includes('/llaveros/') || path.includes('/collares/') || path.includes('/porta_incensos/') || path.includes('/bambalinas/');
    const imgBasePath = isSubfolder ? '../' : '';
    
    // OPTIMIZACION: Usar DocumentFragment para insertar todo el HTML de una sola vez
    const fragment = document.createDocumentFragment();
    
    listaProductos.forEach(producto => {
        const card = document.createElement("div");
        card.className = "producto-card";
        card.dataset.categoria = producto.categoria;
        card.dataset.nombre = producto.nombre.toLowerCase();
        card.dataset.id = producto.id;
        card.dataset.precio = producto.precio;
        card.dataset.imagen = producto.imagen || '';
        
        const precioUSD = producto.precio.toFixed(2);
        const [enteroUSD, decimalesUSD] = precioUSD.split('.');
        
        const precioEnBolivares = producto.precio * tasaCambio;
        const precioVESRedondeado = redondearBolivares(precioEnBolivares);
        
        // ✅ AJUSTE DE SEGURIDAD 1: Si la imagen ya empieza con '/', úsala tal cual. Si no, agrégale el '../'
        const imagenSrc = producto.imagen ? (producto.imagen.startsWith('/') ? producto.imagen : `${imgBasePath}${producto.imagen}`) : null;
        
        // CORRECCION: Se eliminaron los estilos inline. La clase .producto-img en 05-productos.css ya maneja todo.
        const imagenHTML = imagenSrc
            ? `<img src="${imagenSrc}" alt="${producto.nombre}" class="producto-img" onerror="this.outerHTML='<div class=\\'producto-img-placeholder\\'></div>'">` 
            : `<div class="producto-img-placeholder"></div>`;
        
        const esClicable = !!producto.url;
        
        // ✅ AJUSTE DE SEGURIDAD 2: Si la URL ya empieza con '/', úsala tal cual. Si no, aplica la lógica de subcarpeta.
        const productoURL = esClicable 
            ? (producto.url.startsWith('/') ? producto.url : (isSubfolder ? `../${producto.url}` : producto.url))
            : '#';
        
        const contenidoInfo = `
            ${imagenHTML}
            <h3 class="producto-nombre">${producto.nombre}</h3>
            <div class="producto-precio" data-precio-usd="${producto.precio}" data-precio-ves="${precioVESRedondeado}">
                <div class="precio-usd activo-grande">
                    <span class="simbolo">$</span>
                    <span class="entero">${enteroUSD}</span>
                    <span class="decimales">.${decimalesUSD}</span>
                </div>
                <div class="precio-ves activo-pequeno">
                    <span class="simbolo">Bs.</span>
                    <span class="entero">${formatearConPuntosDeMil(precioVESRedondeado)}</span>
                </div>
            </div>
        `;

        // ✅ CAMBIO PRINCIPAL CORREGIDO: Si es el producto personalizado, el botón es un enlace DIRECTO a WhatsApp (igual que el botón verde)
        const esPersonalizado = producto.id === 99 || producto.nombre.toLowerCase().includes('personalizado');
        
        let botonAccion = '';
        if (esPersonalizado) {
            // Enlace directo a WhatsApp, target="_blank" para abrir en nueva pestaña y no salir del sitio
            botonAccion = `<a href="https://wa.me/584242612752?text=Hola,%20quiero%20hacer%20un%20pedido%20de%20marcalibros%20personalizados" target="_blank" class="btn-agregar-carrito" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center; background: #25D366; color: white;">💬 Cotizar</a>`;
        } else {
            // Comportamiento normal: botón de Agregar al carrito
            botonAccion = `<button class="btn-agregar-carrito" data-id="${producto.id}">Agregar</button>`;
        }

        // Se usa una clase 'card-link' en lugar de estilos inline para el enlace
        card.innerHTML = `
            ${esClicable ? `<a href="${productoURL}" class="card-link">${contenidoInfo}</a>` : contenidoInfo}
            ${botonAccion}
        `;
        
        fragment.appendChild(card);
    });

    // Insercion unica en el DOM (mucho mas rapido que hacerlo en cada iteracion)
    gridProductos.appendChild(fragment);
    console.log(`[PRODUCTOS]: ${listaProductos.length} productos renderizados correctamente.`);
}
