const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('src')); 

let programas = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/vistas/index.html');
});

app.post('/agregar-programa', (req, res) => {
    const { nombre, tamano } = req.body;
    if (!nombre || !tamano) {
        return res.status(400).json({ message: 'Nombre y tamaño del programa son requeridos' });
    }
    programas.push({ nombre, tamano });
    res.status(200).json({ message: 'Programa agregado correctamente' });
});

app.get('/programas', (req, res) => {
    // Devuelve la lista de programas
    res.json(programas);
});

app.post('/seleccionar-algoritmo', (req, res) => {
    const { algoritmo } = req.body;
    // Recibe la selección del algoritmo
    res.status(200).json({ message: `Algoritmo ${algoritmo} seleccionado correctamente` });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
