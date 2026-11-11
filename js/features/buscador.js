// ==========================================
// BUSCADOR DE PRODUCTOS CON VISTA PREVIA
// ==========================================

import { PRODUCTOS } from '../config.js';

// Función auxiliar para eliminar tildes y hacer la búsqueda más flexible
function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function inicializarBuscador() {
    const buscadorInput = document.getElementById('buscador-input');
    const productosGrid = document.getElementById('productos-grid');

    if (!buscadorInput) {
        console.warn('⚠️ [BUSCADOR]: No se encontró el input de búsqueda en esta página.');
        return;
    }

    console.log('🔍 [BUSCADOR]: Inicializado con vista previa y soporte móvil.');

    // 1. Crear el contenedor del menú desplegable dinámicamente
    const dropdown = document.createElement('div');
    dropdown.className = 'buscador-dropdown';
    
    const buscadorHeader = document.querySelector('.buscador-header');
    if (buscadorHeader) {
        buscadorHeader.appendChild(dropdown);
    }

    // 2. Solución para Chrome/Android: Forzar foco sin bloquear el teclado nativo
    buscadorInput.addEventListener('click', () => {
        buscadorInput.focus();
    });

    buscadorInput.addEventListener('touchend', () => {
        buscadorInput.focus();
    }, { passive: true });

    // 3. Lógica principal al escribir
    buscadorInput.addEventListener('input', (e) => {
        const termino = normalizarTexto(e.target.value);
        
        // ==========================================
        // A. Filtrar las tarjetas en la página (si existe el grid)
        // ==========================================
        if (productosGrid) {
            let visibles = 0;
            document.querySelectorAll('.producto-card').forEach(tarjeta => {
                const nombre = normalizarTexto(tarjeta.dataset.nombre || '');
                if (nombre.includes(termino)) {
                    tarjeta.classList.remove('oculto');
                    visibles++;
                } else {
                    tarjeta.classList.add('oculto');
                }
            });

            // Manejo del mensaje "Sin resultados" en la grilla
            let sinResultados = productosGrid.querySelector('.sin-resultados');
            if (!sinResultados) {
                sinResultados = document.createElement('div');
                sinResultados.className = 'sin-resultados';
                sinResultados.textContent = 'No se encontraron productos que coincidan con tu búsqueda. 🎨';
                productosGrid.appendChild(sinResultados);
            }
            sinResultados.classList.toggle('visible', termino !== '' && visibles === 0);
        }

        // ==========================================
        // B. Mostrar el menú desplegable con fotos
        // ==========================================
        dropdown.innerHTML = ''; // Limpiar resultados anteriores
        
        if (termino.length < 2) {
            dropdown.classList.remove('activo');
            return;
        }

        // Buscar en la lista completa de productos importada
        const resultados = PRODUCTOS.filter(p => normalizarTexto(p.nombre).includes(termino));

        if (resultados.length > 0) {
            resultados.forEach(producto => {
                const item = document.createElement('div');
                item.className = 'resultado-item';
                
                // ✅ CORRECCIÓN DE RUTAS DE IMAGEN:
                // Si la ruta ya empieza con '/', es absoluta y se usa tal cual.
                // Si no, se aplica la lógica de subcarpeta (../)
                let imgSrc = '';
                if (producto.imagen) {
                    if (producto.imagen.startsWith('/')) {
                        imgSrc = producto.imagen;
                    } else {
                        const path = window.location.pathname;
                        const isSubfolder = path.includes('/portavelas/') || path.includes('/marcalibros/') || path.includes('/llaveros/') || path.includes('/collares/') || path.includes('/porta_incensos/') || path.includes('/bambalinas/');
                        imgSrc = isSubfolder ? `../${producto.imagen}` : producto.imagen;
                    }
                }

                item.innerHTML = `
                    <img src="${imgSrc}" alt="${producto.nombre}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="resultado-item-placeholder" style="display:none; width:40px; height:40px; background:var(--gris-claro); border-radius:50%; align-items:center; justify-content:center; margin-right:10px;">🎨</div>
                    <span>${producto.nombre}</span>
                `;

                // ✅ CORRECCIÓN DE RUTAS DE ENLACE (URL):
                // Misma lógica: si es absoluta, se usa tal cual. Si es relativa, se ajusta.
                item.addEventListener('click', () => {
                    if (producto.url) {
                        let urlDestino = producto.url;
                        
                        if (urlDestino.startsWith('/')) {
                            // Es ruta absoluta, ir directamente
                            window.location.href = urlDestino;
                        } else {
                            // Es ruta relativa, aplicar lógica de subcarpeta
                            const path = window.location.pathname;
                            const isSubfolder = path.includes('/portavelas/') || path.includes('/marcalibros/') || path.includes('/llaveros/') || path.includes('/collares/') || path.includes('/porta_incensos/') || path.includes('/bambalinas/');
                            
                            if (urlDestino.includes('/')) {
                                urlDestino = isSubfolder ? `../${urlDestino}` : urlDestino;
                            } else {
                                urlDestino = isSubfolder ? `../${producto.categoria}/${urlDestino}` : `${producto.categoria}/${urlDestino}`;
                            }
                            window.location.href = urlDestino;
                        }
                    }
                });

                dropdown.appendChild(item);
            });
            dropdown.classList.add('activo');
        } else {
            dropdown.innerHTML = '<div class="resultado-vacio">Sin resultados</div>';
            dropdown.classList.add('activo');
        }
    });

    // 4. Cerrar el menú desplegable si se hace clic fuera del buscador
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.buscador-header')) {
            dropdown.classList.remove('activo');
        }
    });
}
