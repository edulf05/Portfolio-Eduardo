const express = require('express');
const cors = require('cors');
const path = require('path');

// rota de projetos (verifica se existe)
let projetoRoutes;
try {
  projetoRoutes = require('./routes/projetoRoutes');
} catch (e) {
  console.warn('Rotas de projeto não encontradas:', e.message);
  projetoRoutes = null;
}

const app = express();
app.use(cors());
app.use(express.json());

// servir assets estáticos usados pela app (imagens, ícones, thumbs)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// servir a pasta view (frontend) se quiser acessar pelo Node: http://localhost:3000/view/home.html
app.use('/view', express.static(path.join(__dirname, 'view')));

// rotas de API
if (projetoRoutes) app.use('/', projetoRoutes);

// rota raiz opcional redireciona para view/home.html
app.get('/', (req, res) => res.redirect('/view/home.html'));

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// erro genérico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));