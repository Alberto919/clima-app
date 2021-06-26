const fs = require('fs');
const axios = require('axios');


class Busquedas {
    historial = [];
    dbpath = './db/database.json'

    constructor() {
        //TODO: leer db si existe
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    async ciudad(lugar = '') {
        //Peticion http
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (err) {
            return [];
        }
    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    get historialCapitalizado(){
        return this.historial.map(lugar =>{
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ')
        });
    }

    async climaPorLugar(lat, lon) {
        try {
            //crear instancia de axios
            const instance = axios.create({
                baseURL: `http://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }
            });
            //respuesta estraer la data de
            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (err) {
            console.log(err);
        }
    }

    agregarHistorial(lugar=''){
        //TODO: prevenir duplicador
        if (this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar.toLocaleLowerCase());

        //Grabar en DB
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbpath, JSON.stringify(payload));
    }

    leerDB(){
        //Debe existir
        if(!fs.existsSync(this.dbpath)) return;

        //const info
        const info = fs.readFileSync(this.dbpath, {encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;
    }
}

module.exports = Busquedas;