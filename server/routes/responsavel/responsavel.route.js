import express from "express";
import { responsavelController } from "../../controller/responsavel/responsavel.controller.js";

const responsavelRotas = express.Router();

// CRUD básico
responsavelRotas.post("/", responsavelController.criarResponsavel);
responsavelRotas.get("/", responsavelController.buscarResponsaveis);
responsavelRotas.get("/neo4j", responsavelController.buscarResponsaveisNeo4j);
responsavelRotas.get("/:id", responsavelController.buscarUmResponsavel);
responsavelRotas.put("/:id", responsavelController.atualizarResponsavel);
responsavelRotas.delete("/:id", responsavelController.desativarResponsavel);

// Rotas para relacionamentos com denúncias
responsavelRotas.post("/atribuir-denuncia", responsavelController.atribuirDenuncia);
responsavelRotas.get("/:id/denuncias", responsavelController.buscarDenunciasPorResponsavel);

export { responsavelRotas };