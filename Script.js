document.addEventListener('DOMContentLoaded', () => {

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelectorAll('.navbar-menu a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            } else if (this.getAttribute('href') === '#inicio') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // ===== TIMELINE =====
    function checkTimelineScroll() {
        const items = document.querySelectorAll('.timeline-item');
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                item.classList.add('visible');
            }
        });
    }
    
    if (document.querySelector('.timeline-item')) {
        window.addEventListener('scroll', checkTimelineScroll);
        checkTimelineScroll();
    }

    // ===== SECTIONS =====
    function checkSectionScroll() {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75) {
                section.classList.add('visible');
            }
        });
    }
    
    if (document.querySelector('.section')) {
        window.addEventListener('scroll', checkSectionScroll);
        checkSectionScroll();
    }

    // ===== HEARTS =====
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.text-content') && !e.target.closest('.photo-container')) {
            createHeart(e.pageX, e.pageY);
        }
    });

    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'floating-hearts';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        heart.style.animation = `float ${Math.random() * 2 + 3}s ease-out forwards`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }   

    // ===== MAPA (solo si existe el elemento #map) =====
    if (document.getElementById('map')) {
        // Inicializar el mapa
        const map = L.map('map').setView([41.5034, -5.7447], 6);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Array para almacenar lugares
        let places = [
             {
            "name": "Banco del primer beso",
            "lat": 43.357179,
            "lng": -2.856067,
            "date": "2024-07-01",
            "description": "El banco en donde nos dimos nuestro primer beso, el banco más especial no solo para nuestra relación, si no que tabién para mí."
        },
        {
            "name": "La caseta",
            "lat": 43.357469,
            "lng": -2.855891,
            "date": "2024-07-18",
            "description": "Cuantos buenos recuerdos en un solo sitio, tanto tiempo yendo a un mismo sitio... Al final es normal tener tantos recuerdos."
        },
        {
            "name": "Kokoxaxa",
            "lat": 43.260108,
            "lng": -2.930354,
            "date": "2024-12-26",
            "description": "El lugar al que fuimos a comer juntos por primera vez. Un bufé lleno de comida y amor. "
        },
        {
            "name": "Olalde",
            "lat": 43.357199,
            "lng": -2.84937,
            "date": "2024-08-03",
            "description": "Es el primer cine al que fuimos, fuimos a ver \"Inside Out 2\"."
        },
        {
            "name": "Banco en la montaña",
            "lat": 43.347106,
            "lng": -2.838633,
            "date": "2024-08-22",
            "description": "Es el banco al que íbamos que estaba detrás del polideportivo, al que íbamos para estar a solas al principio."
        },
        {
            "name": "Casa Nene",
            "lat": 43.3306,
            "lng": -2.800466,
            "date": "2025-07-01",
            "description": "Esta es la zona con más recuerdos de todos, la casa de tu Nene."
        }
        ];

        // Icono personalizado
        const heartIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="font-size: 30px;">💜</div>',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });

        // Cargar lugares guardados del almacenamiento
        function loadPlaces() {
            const saved = localStorage.getItem('romanticPlaces');
            if (saved) {
                places = JSON.parse(saved);
            }
            renderPlaces();
        }

        // Guardar lugares
        function savePlacesToStorage() {
            localStorage.setItem('romanticPlaces', JSON.stringify(places));
        }

        // Renderizar lugares en el mapa y lista
        function renderPlaces() {
            // Limpiar marcadores existentes
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });

            // Añadir marcadores
            places.forEach((place, index) => {
                const marker = L.marker([place.lat, place.lng], { icon: heartIcon })
                    .addTo(map)
                    .bindPopup(`
                        <h3>${place.name}</h3>
                        <div class="popup-date">${new Date(place.date).toLocaleDateString('es-ES')}</div>
                        <div class="popup-description">${place.description}</div>
                    `);
            });

            // Renderizar lista
            const listContainer = document.getElementById('placesList');
            if (listContainer) {
                listContainer.innerHTML = '';
                
                places.forEach((place, index) => {
                    const card = document.createElement('div');
                    card.className = 'place-card';
                    card.innerHTML = `
                        <h3>${place.name}</h3>
                        <div class="date">${new Date(place.date).toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</div>
                        <div class="description">${place.description}</div>
                        <button class="delete-btn" onclick="deletePlace(${index})">Eliminar</button>
                    `;
                    card.onclick = (e) => {
                        if (!e.target.classList.contains('delete-btn')) {
                            map.setView([place.lat, place.lng], 13);
                        }
                    };
                    listContainer.appendChild(card);
                });
            }
        }

        // Hacer funciones globales para el mapa
        window.addPlace = function() {
            const modal = document.getElementById('addPlaceModal');
            if (modal) modal.classList.add('active');
        }

        window.closeModal = function() {
            const modal = document.getElementById('addPlaceModal');
            if (modal) {
                modal.classList.remove('active');
                // Limpiar formulario
                document.getElementById('placeName').value = '';
                document.getElementById('placeDate').value = '';
                document.getElementById('placeLat').value = '';
                document.getElementById('placeLng').value = '';
                document.getElementById('placeDescription').value = '';
            }
        }

        window.savePlace = function() {
            const name = document.getElementById('placeName').value;
            const date = document.getElementById('placeDate').value;
            const lat = parseFloat(document.getElementById('placeLat').value);
            const lng = parseFloat(document.getElementById('placeLng').value);
            const description = document.getElementById('placeDescription').value;

            if (!name || !date || !lat || !lng || !description) {
                alert('Por favor, completa todos los campos');
                return;
            }

            places.push({ name, lat, lng, date, description });
            savePlacesToStorage();
            renderPlaces();
            window.closeModal();
        }

        window.deletePlace = function(index) {
            if (confirm('¿Estás seguro de que quieres eliminar este lugar?')) {
                places.splice(index, 1);
                savePlacesToStorage();
                renderPlaces();
            }
        }

        window.exportData = function() {
            const dataStr = JSON.stringify(places, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'nuestros_lugares.json';
            link.click();
        }

        window.importData = function() {
            document.getElementById('fileInput').click();
        }

        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            places = JSON.parse(event.target.result);
                            savePlacesToStorage();
                            renderPlaces();
                            alert('Lugares cargados correctamente');
                        } catch (error) {
                            alert('Error al cargar el archivo');
                        }
                    };
                    reader.readAsText(file);
                }
            });
        }

        // Cargar lugares al iniciar
        loadPlaces();
    }

    // ===== CONTADOR DE DÍAS (solo si existe el elemento #days) =====
    if (document.getElementById('days')) {
        const startDate = new Date('2024-07-01T05:30:00'); // Fecha de inicio de la relación
        
        function updateCounter() {
            const now = new Date();
            const diff = now - startDate;
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            
            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minutesEl) minutesEl.textContent = minutes;
            if (secondsEl) secondsEl.textContent = seconds;
        }
        
        updateCounter();
        setInterval(updateCounter, 1000);
    }
    
    // ===== CARRUSEL DE FRASES (solo si existen los elementos) =====
    const quotes = document.querySelectorAll('.carousel-quote');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (quotes.length > 0 && dots.length > 0) {
        let currentQuote = 0;
        
        function showQuote(index) {
            quotes.forEach(q => q.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            quotes[index].classList.add('active');
            dots[index].classList.add('active');
        }
        
        function nextQuote() {
            currentQuote = (currentQuote + 1) % quotes.length;
            showQuote(currentQuote);
        }
        
        setInterval(nextQuote, 5000);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentQuote = index;
                showQuote(currentQuote);
            });
        });
    }
    
    // ===== ANIMACIÓN DE RAZONES (solo si existen) =====
    const reasonCards = document.querySelectorAll('.reason-card');
    
    if (reasonCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        reasonCards.forEach(card => observer.observe(card));
    }

});