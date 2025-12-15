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