const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB usando URI de conexión directa
const mongoURI = 'mongodb://localhost:27017/agendaDB';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error de conexión a MongoDB:', err));

// Definir el modelo de Nota
const NotaSchema = new mongoose.Schema({
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    descripcion: { type: String, required: true }
});
const Nota = mongoose.model('Nota', NotaSchema);

// Ruta principal para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rutas de API para manejar notas
app.get('/notas', async (req, res) => {
    try {
        const notas = await Nota.find();
        res.status(200).json(notas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/notas', async (req, res) => {
    const { fecha, hora, descripcion } = req.body;
    const nuevaNota = new Nota({ fecha, hora, descripcion });
    try {
        const notaGuardada = await nuevaNota.save();
        res.status(201).json(notaGuardada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/notas/:id', async (req, res) => {
    const idNota = req.params.id;
    try {
        await Nota.findByIdAndDelete(idNota);
        res.status(200).json({ message: 'Nota eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Configuración del puerto
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

