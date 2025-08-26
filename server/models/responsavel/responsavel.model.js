import mongoose, { Schema } from "mongoose";

const schemaResponsavel = new Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },
    tipo: {
      type: String,
      enum: ["Polícia", "Prefeitura", "Bombeiros", "Secretaria de Obras", "Vigilância Sanitária", "Outros"],
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    telefone: {
      type: String,
      required: true,
      trim: true
    },
    areaAtuacao: {
      type: String,
      required: true
    },
    ativo: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Criar índice para busca textual
schemaResponsavel.index({ nome: "text", areaAtuacao: "text" });

const ResponsavelModel = mongoose.model("Responsavel", schemaResponsavel);

export { ResponsavelModel };