// Obtener los elementos
const popup = document.getElementById('popup');
const closeBtn = document.querySelector('.close');
const video = document.querySelector('#popup video'); // Referencia al video

// Mostrar el pop-up cuando la página cargue
window.onload = function() {
    popup.style.display = 'flex';
    video.play(); // Asegurar que el video se reproduzca al abrir
}

// Función para cerrar el popup y pausar el video
function closePopup() {
    popup.style.display = 'none';
    video.pause();
    video.currentTime = 0; // Opcional: rebobinar al inicio
}

// Cerrar el pop-up cuando se hace clic en el botón de cierre
closeBtn.onclick = closePopup;

// Cerrar el pop-up si se hace clic fuera del contenido
window.onclick = function(event) {
    if (event.target === popup) {
        closePopup();
    }
}