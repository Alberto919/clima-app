const { inquirerMenu, pausa } = require("./helpers/inquirer")



const main = async () => {
    let opt = '';

    do {
        //Imprime el menú
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                //crear opcion
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