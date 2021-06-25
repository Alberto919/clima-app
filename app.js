require('dotenv').config()
const { inquirerMenu, pausa, leerInput, listarLugares } = require("./helpers/inquirer")
const Busquedas = require("./models/busquedas");

const main = async () => {
    let opt = '';
    const busqueda = new Busquedas();

    do {
        //Imprime el menú
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                //Buscar los lugares
                const lugares = await busqueda.ciudad(termino);
                //Seleccionar el lugares
                const idSeleccionado = await listarLugares(lugares);
                const lugarSeleccionado = lugares.find(l => l.id == idSeleccionado);
                //console.log(lugarSeleccionado);

                //Datos de clima
                const clima = await busqueda.climaPorLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
                console.log(clima);
                //Mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre.green);
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Minima:', clima.min);
                console.log('Maxima:', clima.max);
                console.log('El clima esta:', clima.desc.green);
                break;
            case '2':
                break;
            case '3':
                // listar completadas
                break;
        }

        if (opt !== '0') await pausa();

    } while (opt !== '0');
}


main();