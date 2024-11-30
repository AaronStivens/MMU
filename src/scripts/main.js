// Variables globales para configuración
let programas = [];  // Lista de programas
let memoriaVirtual = [];  // Páginas
let memoriaFisica = [];   // Marcos de página
let tablaPaginas = {};    // Tabla de páginas
let algoritmoPaginacion = ''; // Algoritmo seleccionado
const tamañoDePagina = 4 * 1024;
// Configurar memoria según la entrada del usuario
function configurarMemoria(cantidadPaginas, cantidadMarcos, algoritmo) {
    memoriaVirtual = Array.from({ length: cantidadPaginas }, (_, i) => `Página ${i + 1}`);
    memoriaFisica = Array(cantidadMarcos).fill(null);
    tablaPaginas = {};
    memoriaVirtual.forEach(pagina => (tablaPaginas[pagina] = null));
    algoritmoPaginacion = algoritmo;

    console.log('Configuración inicial:');
    console.log('Memoria virtual:', memoriaVirtual);
    console.log('Memoria física:', memoriaFisica);
    console.log('Tabla de páginas:', tablaPaginas);
    console.log('Algoritmo de paginación:', algoritmo);
    actualizarVistaMemoriaFisica();
}

// Agregar programa a la lista
function agregarPrograma(nombre, tamano) {
    // Calcular la cantidad de páginas necesarias para el programa
    const paginasNecesarias = Math.ceil(tamano / tamañoDePagina);  // Asumiendo que 'tamañoDePagina' es el tamaño de cada página

    // Verificar si hay suficientes páginas disponibles
    if (programas.length + paginasNecesarias <= memoriaVirtual.length) {
        for (let i = 0; i < paginasNecesarias; i++) {
            const paginaAsignada = memoriaVirtual[programas.length + i];
            programas.push({ nombre, tamano, pagina: paginaAsignada });
        }
        actualizarListaProgramas();
    } else {
        alert("No hay suficientes páginas disponibles para agregar más programas.");
    }
}

// Actualizar lista de programas en la interfaz
function actualizarListaProgramas() {
    const listaProgramas = document.getElementById('lista-programas');
    listaProgramas.innerHTML = '';
    programas.forEach(programa => {
        const li = document.createElement('li');
        li.textContent = `${programa.nombre} (Tamaño: ${programa.tamano}, Página: ${programa.pagina})`;
        listaProgramas.appendChild(li);
    });
}

// Simular ejecución de programas
function iniciarEmulacion() {
    if (!algoritmoPaginacion) {
        alert('Selecciona un algoritmo de paginación antes de continuar.');
        return;
    }
    let totalFallos = 0;
    programas.forEach(programa => {
        totalFallos += ejecutarPrograma(programa);
    });
    alert(`Emulación completada. Total de fallos de página: ${totalFallos}`);
}

// Ejecución de un programa
function ejecutarPrograma(programa) {
    const pagina = programa.pagina;
    let fallosPagina = 0;

    console.log(`Ejecutando programa: ${programa.nombre} en ${pagina}`);
    if (!memoriaFisica.includes(pagina)) {
        // Fallo de página
        fallosPagina++;
        manejarFalloDePagina(pagina);
    }

    // Actualizar vista de fallos
    const contenedorFallos = document.getElementById('vista-fallos');
    contenedorFallos.textContent = `Fallos de página: ${fallosPagina}`;
    return fallosPagina;
}

// Manejar fallo de página basado en el algoritmo configurado
function manejarFalloDePagina(pagina) {
    switch (algoritmoPaginacion) {
        case 'FIFO':
            manejarFIFO(pagina);
            break;
        case 'Óptimo':
            manejarOptimo(pagina);
            break;
        case 'RLU':
            manejarLRU(pagina);
            break;
        default:
            console.error('Algoritmo no configurado');
    }
}

// Implementación de FIFO
function manejarFIFO(pagina) {
    if (memoriaFisica.includes(null)) {
        const indiceLibre = memoriaFisica.indexOf(null);
        memoriaFisica[indiceLibre] = pagina;  
    } else {
        console.log(`Reemplazando página: ${memoriaFisica[0]} con: ${pagina}`);
        memoriaFisica.shift(); 
        memoriaFisica.push(pagina); 
    }
    actualizarTablaPaginas(pagina);  
}

function manejarOptimo(pagina) {
    if (memoriaFisica.includes(null)) {
        const indiceLibre = memoriaFisica.indexOf(null);
        memoriaFisica[indiceLibre] = pagina;  
    } else {
        const paginaAReemplazar = seleccionarPaginaAReemplazarOptimo(pagina);
        console.log(`Reemplazando página: ${paginaAReemplazar} con: ${pagina}`);
        const indiceReemplazar = memoriaFisica.indexOf(paginaAReemplazar);
        memoriaFisica[indiceReemplazar] = pagina; 
    }
    actualizarTablaPaginas(pagina);
}

function seleccionarPaginaAReemplazarOptimo(paginaNueva) {
    const futurasReferencias = programas.map(programa => programa.pagina);
    const paginasEnMemoria = memoriaFisica.filter(pagina => pagina !== null);
    
    let paginaAReemplazar = null;
    let maxDistanciaFutura = -1;

    paginasEnMemoria.forEach(pagina => {
        let distanciaFutura = -1;

        for (let i = 0; i < futurasReferencias.length; i++) {
            const indiceAcceso = futurasReferencias[i].indexOf(pagina);
            if (indiceAcceso !== -1) {
                distanciaFutura = indiceAcceso;
                break;
            }
        }

        if (distanciaFutura === -1) {
            paginaAReemplazar = pagina;
            return;
        }

        if (distanciaFutura > maxDistanciaFutura) {
            maxDistanciaFutura = distanciaFutura;
            paginaAReemplazar = pagina;
        }
    });

    return paginaAReemplazar;
}

function actualizarTablaPaginas(pagina) {
    memoriaVirtual.forEach(p => (tablaPaginas[p] = memoriaFisica.includes(p) ? memoriaFisica.indexOf(p) : null));
    actualizarVistaMemoriaFisica();
}

function actualizarVistaMemoriaFisica() {
    const contenedor = document.getElementById('vista-memoria-fisica');
    contenedor.innerHTML = '';
    memoriaFisica.forEach((pagina, index) => {
        const div = document.createElement('div');
        div.textContent = pagina ? pagina : 'Libre';
        div.classList.add('memoria-item');
        contenedor.appendChild(div);
    });
}

// Eventos
document.getElementById('form-so').addEventListener('submit', function (event) {
    event.preventDefault();
    const cantidadPaginas = parseInt(document.getElementById('memoria-virtual').value, 10);
    const cantidadMarcos = parseInt(document.getElementById('memoria-fisica').value, 10);
    const algoritmo = document.getElementById('algoritmo').value;
    configurarMemoria(cantidadPaginas, cantidadMarcos, algoritmo);
    alert('Memoria configurada correctamente.');
});

document.getElementById('form-programa').addEventListener('submit', function (event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const tamano = parseInt(document.getElementById('tamano').value, 10);
    agregarPrograma(nombre, tamano);
    alert('Programa agregado correctamente.');
});

document.getElementById('iniciar-emulacion').addEventListener('click', function () {
    iniciarEmulacion();
});
