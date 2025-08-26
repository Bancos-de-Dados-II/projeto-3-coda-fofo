import { responsavelRepository } from "../../repository/responsavel/responsavel.repository.js";
import { ResponsavelNeo4jRepository } from "../../repository/responsavel/responsavel.neo4j.repository.js";
import { BadRequestError, NotFoundError } from "../../utils/helpers/ApiError.js";

class ResponsavelUseCase {
  constructor() {
    this.responsavelRepository = responsavelRepository;
    this.responsavelNeo4jRepository = new ResponsavelNeo4jRepository();
  }

  criarResponsavel = async (responsavelData) => {
    const { nome, tipo, email, telefone, areaAtuacao } = responsavelData;

    if (!nome || !tipo || !email || !telefone || !areaAtuacao) {
      throw new BadRequestError("Todos os campos são obrigatórios");
    }

    const responsavelExistente = await this.responsavelRepository.pegarResponsavelPorEmail(email);
    if (responsavelExistente) {
      throw new BadRequestError("Já existe um responsável com este email");
    }

    const responsavel = await this.responsavelRepository.criarResponsavel(responsavelData);

    try {
      await this.responsavelNeo4jRepository.criarNoResponsavel(
        responsavel._id.toString(), 
        responsavelData
      );
    } catch (error) {
      console.error("Erro ao criar no Neo4J:", error);
      await this.responsavelRepository.desativarResponsavel(responsavel._id);
      throw new BadRequestError("Erro ao criar responsável no sistema de relacionamentos");
    }

    return responsavel;
  };

  buscarUmResponsavel = async (id) => {
    const responsavel = await this.responsavelRepository.pegarResponsavelPorId(id);
    if (!responsavel || !responsavel.ativo) {
      throw new NotFoundError("Responsável não encontrado");
    }
    return responsavel;
  };

  buscarTodosResponsaveis = async () => {
    return await this.responsavelRepository.pegarTodosResponsaveis();
  };

  buscarResponsaveis = async (busca = "") => {
    if (busca) {
      return await this.responsavelRepository.pegarResponsaveisPorBusca(busca);
    }
    return await this.responsavelRepository.pegarTodosResponsaveis();
  };

  atualizarResponsavel = async (id, data) => {
    const responsavel = await this.buscarUmResponsavel(id);

    if (data.email && data.email !== responsavel.email) {
      const emailExistente = await this.responsavelRepository.pegarResponsavelPorEmail(data.email);
      if (emailExistente) {
        throw new BadRequestError("Já existe um responsável com este email");
      }
    }

    const responsavelAtualizado = await this.responsavelRepository.atualizarResponsavel(id, data);

    try {
      await this.responsavelNeo4jRepository.atualizarNoResponsavel(id.toString(), data);
    } catch (error) {
      console.error("Erro ao atualizar no Neo4J:", error);
    }

    return responsavelAtualizado;
  };

  desativarResponsavel = async (id) => {
    await this.buscarUmResponsavel(id);
    const responsavelDesativado = await this.responsavelRepository.desativarResponsavel(id);

    try {
      await this.responsavelNeo4jRepository.desativarNoResponsavel(id.toString());
    } catch (error) {
      console.error("Erro ao desativar no Neo4J:", error);
    }

    return responsavelDesativado;
  };

  atribuirDenuncia = async (denunciaId, responsavelId) => {
    await this.buscarUmResponsavel(responsavelId);
    
    try {
      const resultado = await this.responsavelNeo4jRepository.criarRelacionamentoDenuncia(
        denunciaId.toString(),
        responsavelId.toString()
      );
      return resultado;
    } catch (error) {
      console.error("Erro ao atribuir denúncia:", error);
      throw new BadRequestError("Erro ao atribuir denúncia ao responsável");
    }
  };

  buscarDenunciasPorResponsavel = async (responsavelId) => {
    await this.buscarUmResponsavel(responsavelId);
    
    try {
      const denuncias = await this.responsavelNeo4jRepository.buscarDenunciasPorResponsavel(
        responsavelId.toString()
      );
      return denuncias;
    } catch (error) {
      console.error("Erro ao buscar denúncias:", error);
      throw new BadRequestError("Erro ao buscar denúncias do responsável");
    }
  };

  buscarResponsaveisNeo4j = async () => {
    try {
      return await this.responsavelNeo4jRepository.buscarTodosResponsaveisNeo4j();
    } catch (error) {
      console.error("Erro ao buscar responsáveis no Neo4J:", error);
      throw new BadRequestError("Erro ao buscar responsáveis no sistema de relacionamentos");
    }
  };
}

const responsavelUseCase = new ResponsavelUseCase();

export { responsavelUseCase };