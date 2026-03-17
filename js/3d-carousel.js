// Configuración responsive
var isDragging = false;
var startX;
var scale = 0.5;
var distanceItems = '350px'; // Valor por defecto

var carousel = document.getElementById('carousel');
var items = Array.from(carousel.children);

// Función para calcular distancia responsive
function getResponsiveDistance() {
    const width = window.innerWidth;
    if (width < 480) {
        return '150px'; // Móviles pequeños
    } else if (width < 768) {
        return '150px'; // Móviles grandes
    } else if (width < 1024) {
        return '280px'; // Tablets
    } else {
        return '350px'; // Escritorio
    }
}

// Función para actualizar la escala y distancia
function updateResponsiveSettings() {
    const width = window.innerWidth;
    
    // Ajustar escala del drag según el tamaño de pantalla
    if (width < 480) {
        scale = 0.3;
    } else if (width < 768) {
        scale = 0.3;
    } else if (width < 1024) {
        scale = 0.45;
    } else {
        scale = 0.5;
    }
    
    // Actualizar distancia
    distanceItems = getResponsiveDistance();
    
    // Recalcular posiciones
    updateAllItems(parseFloat(carousel.style.getPropertyValue('--rotation') || 0));
}

// Función para actualizar todos los items
function updateAllItems(currentRotation) {
    items.forEach(function (item, index) {
        const angle = index * (360 / items.length);
        const rotation = angle + currentRotation;
        const translation = 'translateZ(' + distanceItems + ') rotateY(' + -rotation + 'deg)';
        item.style.transform = 'rotateY(' + angle + 'deg) ' + translation;
    });
}

// Event listeners para responsive
window.addEventListener('resize', function() {
    updateResponsiveSettings();
});

// Event listeners existentes
carousel.addEventListener('mousedown', handleDragStart);
document.addEventListener('mouseup', handleDragEnd);
document.addEventListener('mousemove', handleDragMove);
carousel.addEventListener('selectstart', function (e) {
    e.preventDefault();
});

// Touch events para móviles
carousel.addEventListener('touchstart', handleTouchStart, { passive: false });
carousel.addEventListener('touchmove', handleTouchMove, { passive: false });
carousel.addEventListener('touchend', handleTouchEnd);

function handleTouchStart(e) {
    e.preventDefault();
    isDragging = true;
    startX = e.touches[0].clientX;
    document.body.style.cursor = 'grabbing';
}

function handleTouchMove(e) {
    e.preventDefault();
    if (isDragging) {
        const deltaX = (e.touches[0].clientX - startX) * scale;
        startX = e.touches[0].clientX;

        let currentRotation = parseFloat(carousel.style.getPropertyValue('--rotation') || 0);
        updateCarouselRotation(deltaX, currentRotation);
    }
}

function handleTouchEnd() {
    isDragging = false;
    document.body.style.cursor = 'grab';
}

// Modificar handleDragMove para usar la escala responsive
function handleDragMove(e) {
    if (isDragging) {
        const deltaX = (e.clientX - startX) * scale;
        startX = e.clientX;

        let currentRotation = parseFloat(carousel.style.getPropertyValue('--rotation') || 0);
        updateCarouselRotation(deltaX, currentRotation);
    }
}

items.forEach(function (item, index) {
    item.addEventListener('mousedown', function (mousedownEvent) {
        handleItemClick(mousedownEvent, index);
    });
    
    // Añadir soporte táctil para items
    item.addEventListener('touchstart', function (e) {
        e.preventDefault();
        handleItemClick(e, index);
    });
});

function updateCarouselRotation(deltaX, currentRotation) {
    carousel.style.transform = 'rotateY(' + (currentRotation + deltaX) + 'deg)';
    carousel.style.setProperty('--rotation', currentRotation + deltaX);
    
    updateAllItems(currentRotation + deltaX);
}

// El resto de tus funciones se mantienen igual
function handleDragStart(e) {
    isDragging = true;
    startX = e.clientX;
    document.body.style.cursor = 'grabbing';
}

function handleDragEnd() {
    isDragging = false;
    document.body.style.cursor = 'grab';
}

function handleItemClick(mousedownEvent, index) {
    let isMouseDown = true;
    const startX = mousedownEvent.clientX || (mousedownEvent.touches ? mousedownEvent.touches[0].clientX : 0);

    function handleMouseMove(e) {
        if (isMouseDown) {
            const currentX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
            const dragDistance = Math.abs(currentX - startX);

            if (dragDistance > 5) {
                isMouseDown = false;
            }
        }
    }

    function handleMouseUp() {
        if (isMouseDown) {
            handleItemClickEnd(index);
        }
        isMouseDown = false;
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
}

function handleItemClickEnd(index) {
    let currentRotation = parseFloat(carousel.style.getPropertyValue('--rotation') || 0);

    const anglePerItem = 360 / items.length;
    let targetRotation;

    const val1 = 360 - (index * anglePerItem);
    const val2 = index * -anglePerItem;

    if (currentRotation === 0 && index === items.length - 1) {
        rotateCarousel(360 / items.length);
    } else if (index === 0 && currentRotation < -180) {
        rotateCarousel(-360);
    } else {
        const diff1 = Math.abs(currentRotation - val1);
        const diff2 = Math.abs(currentRotation - val2);

        if (diff1 < diff2) {
            targetRotation = val1;
        } else {
            targetRotation = val2;
        }

        rotateCarousel(targetRotation);
    }
}

function rotateCarousel(rotation) {
    carousel.style.transition = 'transform 0.5s ease-in-out';
    carousel.style.transform = 'rotateY(' + rotation + 'deg)';
    carousel.style.setProperty('--rotation', rotation);

    const currentRotation = parseFloat(carousel.style.getPropertyValue('--rotation') || 0);

    function handleTransitionEnd() {
        carousel.style.transition = '';
        carousel.removeEventListener('transitionend', handleTransitionEnd);

        items.forEach(function (item) {
            item.style.transition = '';
        });

        if (currentRotation === 360 || currentRotation === -360) {
            resetCarousel(0);
        }
    }

    carousel.addEventListener('transitionend', handleTransitionEnd);

    items.forEach(function (item, index) {
        const angle = index * (360 / items.length);
        const rotation = angle + currentRotation;
        const translation = 'translateZ(' + distanceItems + ') rotateY(' + -rotation + 'deg)';
        item.style.transition = 'transform 0.5s ease-in-out';
        item.style.transform = 'rotateY(' + angle + 'deg) ' + translation;
    });
}

function resetCarousel(rotation) {
    carousel.style.transform = 'rotateY(' + rotation + 'deg)';
    carousel.style.setProperty('--rotation', rotation);

    items.forEach(function (item, index) {
        const angle = index * (360 / items.length);
        const translation = 'translateZ(' + distanceItems + ') rotateY(-' + angle + 'deg)';
        item.style.transform = 'rotateY(' + angle + 'deg) ' + translation;
    });
}

// Inicializar con configuración responsive
updateResponsiveSettings();
handleItemClickEnd(0);