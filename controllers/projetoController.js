const Projeto = require("../models/projetoModel");


module.exports = {
  async listar(req, res, next) {
    try {
      const rows = await Projeto.listar();
      res.json(rows);
    } catch (err) {
      next(err);
    }
  },

  async buscarPorId(req, res, next) {
    try {
      const id = req.params.id;
      const row = await Projeto.buscarPorId(id);
      if (!row) return res.status(404).json({ message: "Projeto não encontrado." });
      res.json(row);
    } catch (err) {
      next(err);
    }
  },

  async inserir(req, res, next) {
    try {
      const body = req.body || {};

      // validações mínimas (mantém as suas validações)
      const categoriasValidas = ['Web','Mobile','API'];

      if (!body.categoria || !categoriasValidas.includes(body.categoria)) {
        return res.status(400).json({ message: "Categoria inválida." });
      }

      const result = await Projeto.inserir(body);
      return res.status(201).json({ id: result, message: "Projeto cadastrado com sucesso!" });
    } catch (err) {
      console.error('Erro ao inserir projeto:', err);
      return res.status(500).json({ message: 'Erro interno ao criar projeto.' });
    }
  },

  async atualizar(req, res, next) {
    try {
      const id = req.params.id;
      const dados = req.body;
      const affected = await Projeto.atualizar(id, dados);
      if (!affected) return res.status(404).json({ message: "Projeto não encontrado." });
      res.json({ message: "Projeto atualizado com sucesso." });
    } catch (err) {
      next(err);
    }
  },

  async excluir(req, res, next) {
    try {
      const id = req.params.id;
      const affected = await Projeto.excluir(id);
      if (!affected) return res.status(404).json({ message: "Projeto não encontrado." });
      res.json({ message: "Projeto removido com sucesso." });
    } catch (err) {
      next(err);
    }
  }
};