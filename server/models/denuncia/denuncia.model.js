import mongoose, { Schema } from "mongoose";

const schemaDenuncia = new Schema(
  {
    titulo: String,
    descricao: String,
    categoria: {
      type: String,
      enum: ["Infraestrutura", "Segurança", "Meio Ambiente", "Outros"],
      default: "Outros",
    },
    localizacao: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

schemaDenuncia.index(
  {
    titulo: "text",
    descricao: "text",
  },
  {
    default_language: "portuguese",
    weights: {
      titulo: 2,
      descricao: 1,
    },
  }
);
schemaDenuncia.index({ localizacao: "2dsphere" });

const DenunciaModel = mongoose.model("Denuncia", schemaDenuncia);

export { DenunciaModel };
