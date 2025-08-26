import { getNeo4jDriver } from "../config/database.js";

class Neo4jBaseRepository {
  constructor() {
    // Não inicializa o driver no construtor
    this.driver = null;
  }

  async getDriver() {
    if (!this.driver) {
      this.driver = getNeo4jDriver();
    }
    return this.driver;
  }

  async executarQuery(query, parametros = {}) {
    const driver = await this.getDriver();
    const session = driver.session();
    try {
      const resultado = await session.run(query, parametros);
      return resultado;
    } catch (error) {
      console.error('Erro na query Neo4j:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async criarNo(rotulo, propriedades) {
    const query = `
      CREATE (n:${rotulo} $propriedades)
      RETURN n
    `;
    const resultado = await this.executarQuery(query, { propriedades });
    return resultado.records[0].get('n').properties;
  }

  async criarRelacionamento(deRotulo, dePropriedades, paraRotulo, paraPropriedades, tipoRelacionamento, propriedadesRel = {}) {
    const query = `
      MATCH (a:${deRotulo} $dePropriedades), (b:${paraRotulo} $paraPropriedades)
      CREATE (a)-[r:${tipoRelacionamento} $propriedadesRel]->(b)
      RETURN r
    `;
    const resultado = await this.executarQuery(query, {
      dePropriedades,
      paraPropriedades,
      propriedadesRel
    });
    return resultado.records[0].get('r').properties;
  }
}

export { Neo4jBaseRepository };