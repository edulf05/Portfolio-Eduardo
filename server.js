const express = require('express');
const app = express();
const cors = require('cors');
const projetoRoutes = require('./routes/projetoRoutes');

app.use(cors());
app.use(express.json());
app.use('/', projetoRoutes);

app.listen(3000, () => console.log('API rodando na porta 3000'));