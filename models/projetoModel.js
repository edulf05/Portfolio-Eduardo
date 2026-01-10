const conn = require("../config/knex");

module.exports = {
  listar() {
    return conn("projetos").select("*").orderBy("data_inicio", "desc");
  },

  buscarPorId(id) {
    return conn("projetos").where("id_projeto", id).first();
  },

  inserir(projeto) {
    return conn("projetos").insert(projeto);
  },

  atualizar(id, dados) {
    return conn("projetos").where("id_projeto", id).update(dados);
  },

  excluir(id) {
    return conn("projetos").where("id_projeto", id).del();
  }
};