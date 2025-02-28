// Importa le librerie necessarie
const express = require('express');
const app = express();
const port = 3000;
// Serve i file statici dalla cartella 'public'
app.use(express.static('public'));
// Carica le variabili d'ambiente dal file .env
require('dotenv').config()

// Ottiene la chiave API dalle variabili d'ambiente
const API_KEY = process.env.API_KEY;

// Gestisce le richieste GET all'endpoint '/weather'
app.get('/weather', async (req, res) => {
    // Estrae città e unità di misura dai parametri della query
    let { citta, unita } = req.query;
    // Converte l'unità di misura nel formato richiesto dall'API
    const units = unita === 'fahrenheit' ? 'imperial' : 'metric';

    try {
        // Ottiene il meteo corrente dalla prima API
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${citta}&appid=${API_KEY}&units=${units}`);
        
        // Verifica se la richiesta è andata a buon fine
        if (!currentWeatherResponse.ok) {
            throw new Error(`Failed to fetch weather data for ${citta}`);
        }
        
        // Converte la risposta in formato JSON
        const currentWeather = await currentWeatherResponse.json();
        
        // Ottiene le previsioni per 5 giorni usando le coordinate della prima chiamata
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${currentWeather.coord.lat}&lon=${currentWeather.coord.lon}&appid=${API_KEY}&units=${units}`
        );
        
        const forecastData = await forecastResponse.json();

        // Combina entrambe le risposte e le invia al client
        res.json({
            current: currentWeather,
            forecast: forecastData
        });
        
    } catch (error) {
        // Gestisce gli errori inviando un messaggio di errore al client
        res.status(404).json({ error: error.message });
    }
});

// Avvia il server sulla porta specificata
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
