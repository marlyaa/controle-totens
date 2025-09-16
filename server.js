// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ===================================================================
// CORREÇÃO: Coloque a sua URL de conexão entre aspas simples (' ')
// SUBSTITUA `<db_password>` pela sua senha real do banco de dados
// ===================================================================
const mongoURI = 'mongodb+srv://admin-dashboard:LKtppiH05ew7MZPD@cluster0.p0xyz2x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Conexão com o banco de dados
mongoose.connect(mongoURI)
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(err => console.error('Erro de conexão:', err));

// Definição da estrutura dos dados (como um totem deve ser)
const totemSchema = new mongoose.Schema({
    local: String,
    referencia: String,
    responsavel: String,
    telefone: String,
    inicio: String,
    fim: String,
    valor: Number,
    status: String,
});

const Totem = mongoose.model('Totem', totemSchema);

// Middleware (regras para o servidor)
app.use(cors());
app.use(express.json());

// ---- Endpoints da API (pontos de acesso para o seu dashboard) ----

// GET: Retorna todos os totens do banco de dados
app.get('/api/totens', async (req, res) => {
    try {
        const totens = await Totem.find();
        res.json(totens);
    } catch (err) {
        res.status(500).send(err);
    }
});

// POST: Adiciona um novo totem
app.post('/api/totens', async (req, res) => {
    try {
        const newTotem = new Totem(req.body);
        const savedTotem = await newTotem.save();
        res.status(201).json(savedTotem);
    } catch (err) {
        res.status(400).send(err);
    }
});

// PUT: Atualiza um totem existente pelo ID
app.put('/api/totens/:id', async (req, res) => {
    try {
        const updatedTotem = await Totem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTotem);
    } catch (err) {
        res.status(400).send(err);
    }
});

// DELETE: Exclui um totem pelo ID
app.delete('/api/totens/:id', async (req, res) => {
    try {
        await Totem.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});