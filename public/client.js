// SCRIPT PER IL LATO CLIENT

// Otteniamo i riferimenti ai elementi del DOM che useremo
    const weatherSubmit = document.getElementById('weather_submit');
    const celsiusBtn = document.getElementById('celsius');
    const fahrenheitBtn = document.getElementById('fahrenheit');

    // Gestori degli eventi per il cambio di unità di misura (°C/°F)
    celsiusBtn.addEventListener('click', () => {
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
    });

    fahrenheitBtn.addEventListener('click', () => {
        fahrenheitBtn.classList.add('active');
        celsiusBtn.classList.remove('active');
    });

    // Gestore principale dell'evento di ricerca meteo
    weatherSubmit.addEventListener('click', async (e) => {
        e.preventDefault(); // Previene il comportamento predefinito del form
        // Ottiene la città inserita e l'unità di misura selezionata
        const citta = document.querySelector('input').value;
        const unita = document.querySelector('.unit-btn.active').id;
        
        try {
            // Effettua la richiesta al server per ottenere i dati meteo
            const response = await fetch(`/weather?citta=${citta}&unita=${unita}`);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            // Aggiorna le informazioni del meteo corrente nel DOM
            const current = data.current;
            document.getElementById('weather_main_icon').className = `wi wi-owm-${current.weather[0].id}`;
            document.getElementById('weather_main_temp').textContent = `${Math.round(current.main.temp)}°${unita === 'celsius' ? 'C' : 'F'}`;
            document.getElementById('weather_main_city').textContent = current.name;
            document.getElementById('weather_main_descr').textContent = current.weather[0].description;
            document.getElementById('weather_main_humidity').textContent = `Umidità: ${current.main.humidity}%`;
            document.getElementById('weather_main_wind').textContent = `Vento: ${Math.round(current.wind.speed)} ${unita === 'celsius' ? 'm/s' : 'mph'}`;

            // Aggiorna le previsioni dei prossimi giorni
            const weatherWeek = document.getElementById('weather_week');
            weatherWeek.innerHTML = ''; // Pulisce le previsioni precedenti

            // Ottiene una previsione al giorno (ogni 8° elemento poiché i dati sono in intervalli di 3 ore)
            const dailyForecasts = data.forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5);

            // Crea e aggiunge gli elementi per ogni giorno di previsione
            dailyForecasts.forEach((forecast, index) => {
                const date = new Date(forecast.dt * 1000);
                const weekDays = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
                const dayName = weekDays[date.getDay()];
                
                const div = document.createElement('div');
                div.innerHTML = `
                    <h2>${dayName}</h2>
                    <i class="wi wi-owm-${forecast.weather[0].id}"></i>
                    <p>${Math.round(forecast.main.temp)}°${unita === 'celsius' ? 'C' : 'F'}</p>
                `;
                weatherWeek.appendChild(div);
            });

        } catch (error) {
            // Gestione degli errori
            console.error('Errore:', error);
            alert('Città non trovata o errore nel caricamento dei dati meteo');
        }
    });