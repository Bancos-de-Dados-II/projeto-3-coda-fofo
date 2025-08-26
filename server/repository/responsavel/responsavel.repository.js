import { ResponsavelModel } from "../../models/responsavel/responsavel.model.js";

class ResponsavelRepository {
  constructor(responsavelModel) {
    this.responsavelModel = responsavelModel;
  }

  pegarResponsavelPorId = async (id) => {
    return await this.responsavelModel.findById(id);
  };

  pegarResponsavelPorEmail = async (email) => {
    return await this.responsavelModel.findOne({ email });
  };

  pegarTodosResponsaveis = async () => {
    return await this.responsavelModel.find({ ativo: true });
  };

  criarResponsavel = async (responsavel) => {
    return await this.responsavelModel.create(responsavel);
  };

  pegarResponsaveisPorBusca = async (busca) => {
    return await this.responsavelModel.find({
      $text: { $search: busca },
      ativo: true
    });
  };

  atualizarResponsavel = async (id, data = {}) => {
    return await this.responsavelModel.findByIdAndUpdate(id, data, { new: true });
  };

  desativarResponsavel = async (id) => {
    return await this.responsavelModel.findByIdAndUpdate(
      id, 
      { ativo: false }, 
      { new: true }
    );
  };
}

const responsavelRepository = new ResponsavelRepository(ResponsavelModel);

export { responsavelRepository };