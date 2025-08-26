import { DenunciaModel } from "../../models/denuncia/denuncia.model.js";

class DenunciaRepository {
  constructor(denunciaModel) {
    this.denunciaModel = denunciaModel;
  }

  pegarDenunciaPorId = async (id) => {
    return await this.denunciaModel.findById(id);
  };

  pegarTodasDenuncias = async () => {
    return await this.denunciaModel.find();
  };

  gerarDenuncia = async (denuncia) => {
    return await this.denunciaModel.create(denuncia);
  };

  pegarDenunciasPorBuscaTextual = async (busca) => {
    return await this.denunciaModel.find({ $text: { $search: busca } });
  };

  atualizarUmaDenuncia = async (id, data = {}) => {
    return await this.denunciaModel.findByIdAndUpdate(id, data, { new: true });
  };

  deletarDenuncia = async (id) => {
    return await this.denunciaModel.findByIdAndDelete(id);
  };
}

const denunciaRepository = new DenunciaRepository(DenunciaModel);

export { denunciaRepository };
