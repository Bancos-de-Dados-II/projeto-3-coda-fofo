import { denunciaRepository } from "../../repository/denuncia/denuncia.repository.js";
import { BadRequestError } from "../../utils/helpers/ApiError.js";

const QUANTIDADE_CORDENADAS = 2;

class DenunciaUseCase {
  constructor(denunciaRepository) {
    this.denunciaRepository = denunciaRepository;
  }

  criarDenuncia = async (denuncia) => {
    if (
      !denuncia.titulo ||
      !denuncia.descricao ||
      !denuncia.localizacao ||
      denuncia.localizacao.coordinates?.length !== QUANTIDADE_CORDENADAS
    ) {
      throw new BadRequestError("Todos os campos são obrigatórios");
    }

    const denunciaCriada = await this.denunciaRepository.gerarDenuncia(
      denuncia
    );

    return denunciaCriada;
  };

  buscarUmaDenuncia = async (id) => {
    const denuncia = await this.denunciaRepository.pegarDenunciaPorId(id);

    return denuncia;
  };

  _denunciasExistentes = async () => {
    const denuncias = await this.denunciaRepository.pegarTodasDenuncias();

    return denuncias;
  };

  buscarDenuncias = async (busca = null) => {
    const denuncias = busca
      ? await this._denunciasParaUmaBusca(busca)
      : await this._denunciasExistentes();

    return denuncias;
  };

  _denunciasParaUmaBusca = async (busca) => {
    if (typeof busca !== "string" || !busca.trim()) {
      throw new BadRequestError("Parametro de busca inválido");
    }

    const denuncias =
      await this.denunciaRepository.pegarDenunciasPorBuscaTextual(busca);

    return denuncias;
  };

  atualizarUmaDenuncia = async (idDenuncia, data) => {
    const denunciaAtualizada =
      await this.denunciaRepository.atualizarUmaDenuncia(idDenuncia, data);

    return denunciaAtualizada;
  };

  deletarUmaDenuncia = async (idDenuncia) => {
    const denunciaDeletada = await this.denunciaRepository.deletarDenuncia(
      idDenuncia
    );

    return denunciaDeletada;
  };
}

const denunciaUseCase = new DenunciaUseCase(denunciaRepository);

export { denunciaUseCase };
