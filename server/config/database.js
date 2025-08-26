import { iniciarMongoose } from './mongoose.js';
import { iniciarNeo4j } from './neo4j.js';

let neo4jDriver = null;

const conectarBancos = async () => {
  try {
    console.log(' Iniciando conexões com os bancos...');
    
    // Conectar MongoDB
    console.log(' Conectando MongoDB...');
    await iniciarMongoose(process.env.CONNECT_DB);
    
    // Conectar Neo4j
    console.log('Conectando Neo4j...');
    neo4jDriver = await iniciarNeo4j();
    
    console.log("Todos os bancos conectados com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar bancos:", error.message);
    throw error;
  }
};

const getNeo4jDriver = () => {
  if (!neo4jDriver) {
    throw new Error('Driver do Neo4j não inicializado');
  }
  return neo4jDriver;
};

const fecharConexoes = async () => {
  if (neo4jDriver) {
    await neo4jDriver.close();
    console.log("Conexão Neo4j fechada");
  }
};

export { conectarBancos, getNeo4jDriver, fecharConexoes };