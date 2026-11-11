// ==========================================
// LIGHTBOX SIMPLE PARA IMÁGENES DE PRODUCTOS
// ==========================================

export function inicializarLightboxProducto() {
    // Buscar todas las imágenes que tengan la clase 'img-lightbox'
    const imagenes = document.querySelectorAll('.img-lightbox');
    if (imagenes.length === 0) return; // Si no hay, no hacemos nada

    // Crear el modal dinámicamente (así no ensuciamos el HTML de cada producto)
    const modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img class="lightbox-imagen" src="" alt="Vista ampliada">
        </div>
    `;
    document.body.appendChild(modal);

    const imgModal = modal.querySelector('.lightbox-imagen');
    const btnCerrar = modal.querySelector('.lightbox-close');

    // Función para abrir al hacer clic en la imagen
    imagenes.forEach(img => {
        img.style.cursor = 'pointer'; // Indicar visualmente que es clicable
        img.addEventListener('click', () => {
            imgModal.src = img.src;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
        });
    });

    // Función para cerrar
    const cerrar = () => {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaurar scroll
    };

    btnCerrar.addEventListener('click', cerrar);
    
    // Cerrar al hacer clic fuera de la imagen (en el fondo oscuro)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrar();
    });

    // Cerrar con la tecla ESC del teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            cerrar();
        }
    });
    
    console.log('🖼️ [LIGHTBOX PRODUCTO]: Inicializado correctamente.');
                }
