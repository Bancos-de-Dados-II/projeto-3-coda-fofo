import express from "express";
import { denunciaController } from "../../controller/denuncia/denuncia.controller.js";

const denunciaRotas = express.Router();

denunciaRotas.post("/", denunciaController.criarDenuncia);

denunciaRotas.get("/:id", denunciaController.buscarUmaDenuncia);

denunciaRotas.get("/", denunciaController.buscarDenuncias);

denunciaRotas.patch("/:id", denunciaController.atualizarDenuncia);

denunciaRotas.delete("/:id", denunciaController.deletarDenuncia);

export { denunciaRotas };
