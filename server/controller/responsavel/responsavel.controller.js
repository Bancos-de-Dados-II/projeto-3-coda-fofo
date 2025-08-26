import { responsavelUseCase } from "../../use-case/responsavel/responsavel.use-case.js";
import { CREATED, SUCCESS } from "../../utils/helpers/codigosRequisicao.js";

class ResponsavelController {
  constructor(responsavelUseCase) {
    this.responsavelUseCase = responsavelUseCase;
  }

  criarResponsavel = async (req, res, next) => {
    try {
      const responsavelData = req.body;
      const responsavel = await this.responsavelUseCase.criarResponsavel(responsavelData);
      res.status(CREATED).json(responsavel);
    } catch (error) {
      next(error);
    }
  };

  buscarUmResponsavel = async (req, res, next) => {
    try {
      const id = req.params.id;
      const responsavel = await this.responsavelUseCase.buscarUmResponsavel(id);
      res.status(SUCCESS).json(responsavel);
    } catch (error) {
      next(error);
    }
  };

  buscarResponsaveis = async (req, res, next) => {
    try {
      const busca = req.query.q;
      const responsaveis = await this.responsavelUseCase.buscarResponsaveis(busca);
      res.status(SUCCESS).json(responsaveis);
    } catch (error) {
      next(error);
    }
  };

  buscarResponsaveisNeo4j = async (req, res, next) => {
    try {
      const responsaveis = await this.responsavelUseCase.buscarResponsaveisNeo4j();
      res.status(SUCCESS).json(responsaveis);
    } catch (error) {
      next(error);
    }
  };

  atualizarResponsavel = async (req, res, next) => {
    try {
      const id = req.params.id;
      const dados = req.body;
      const responsavel = await this.responsavelUseCase.atualizarResponsavel(id, dados);
      res.status(SUCCESS).json(responsavel);
    } catch (error) {
      next(error);
    }
  };

  desativarResponsavel = async (req, res, next) => {
    try {
      const id = req.params.id;
      const responsavel = await this.responsavelUseCase.desativarResponsavel(id);
      res.status(SUCCESS).json(responsavel);
    } catch (error) {
      next(error);
    }
  };

  atribuirDenuncia = async (req, res, next) => {
    try {
      const { denunciaId, responsavelId } = req.body;
      const resultado = await this.responsavelUseCase.atribuirDenuncia(denunciaId, responsavelId);
      res.status(SUCCESS).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  buscarDenunciasPorResponsavel = async (req, res, next) => {
    try {
      const responsavelId = req.params.id;
      const denuncias = await this.responsavelUseCase.buscarDenunciasPorResponsavel(responsavelId);
      res.status(SUCCESS).json(denuncias);
    } catch (error) {
      next(error);
    }
  };
}

const responsavelController = new ResponsavelController(responsavelUseCase);

export { responsavelController };