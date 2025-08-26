import { connect } from "mongoose";

const iniciarMongoose = async (uri) => {
  try {
    await connect(uri);
    console.log("Mongoose Conectado");
  } catch (error) {
    console.error("Erro ao iniciar a coneção com mongo", error);
  }
};

export { iniciarMongoose };
