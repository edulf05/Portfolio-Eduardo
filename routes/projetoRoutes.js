const express = require("express");
const router = express.Router();
const projetoController = require("../controllers/projetoController");

router.get("/projeto", projetoController.listar);
router.get("/projeto/:id", projetoController.buscarPorId);
router.post("/projeto", projetoController.inserir);
router.put("/projeto/:id", projetoController.atualizar);
router.delete("/projeto/:id", projetoController.excluir);

module.exports = router;