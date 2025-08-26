import { denunciaUseCase } from "../../use-case/denuncia/denuncia.use-case.js";
import { CREATED, SUCCESS } from "../../utils/helpers/codigosRequisicao.js";

class DenunciaController {
  constructor(denunciaUseCase) {
    this.denunciaUseCase = denunciaUseCase;
  }

  criarDenuncia = async (req, res, next) => {
    try {
      const denunciaParaCriar = req.body;

      const denuncia = await this.denunciaUseCase.criarDenuncia(
        denunciaParaCriar
      );

      res.status(CREATED).json(denuncia);
    } catch (error) {
      next(error);
    }
  };

  buscarUmaDenuncia = async (req, res, next) => {
    try {
      const id = req.params.id;

      const denuncia = await this.denunciaUseCase.buscarUmaDenuncia(id);

      res.status(SUCCESS).json(denuncia);
    } catch (error) {
      next(error);
    }
  };

  buscarDenuncias = async (req, res, next) => {
    try {
      const busca = req.query.q;

      const denuncias = await this.denunciaUseCase.buscarDenuncias(busca);

      res.status(SUCCESS).json(denuncias);
    } catch (error) {
      next(error);
    }
  };

  atualizarDenuncia = async (req, res, next) => {
    try {
      const id = req.params.id;
      const denunciaParaAtualizar = req.body;

      const denunciaAtualizada =
        await this.denunciaUseCase.atualizarUmaDenuncia(
          id,
          denunciaParaAtualizar
        );

      res.status(SUCCESS).json(denunciaAtualizada);
    } catch (error) {
      next(error);
    }
  };

  deletarDenuncia = async (req, res, next) => {
    try {
      const id = req.params.id;

      const denunciaDeletada = await this.denunciaUseCase.deletarUmaDenuncia(
        id
      );

      res.status(SUCCESS).json(denunciaDeletada);
    } catch (error) {
      next(error);
    }
  };
}

const denunciaController = new DenunciaController(denunciaUseCase);

export { denunciaController };
