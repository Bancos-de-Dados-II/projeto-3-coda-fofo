import neo4j from 'neo4j-driver';

const iniciarNeo4j = async () => {
  try {
    // Verificar se as variáveis de ambiente estão definidas
    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USER;
    const password = process.env.NEO4J_PASSWORD;

    if (!uri || !user || !password) {
      throw new Error('Variáveis de ambiente do Neo4j não encontradas. Verifique o arquivo .env');
    }

    console.log('Conectando ao Neo4j...');
    console.log('URI:', uri);
    console.log('User:', user);
    
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    
    // Testar a conexão
    const session = driver.session();
    await session.run('RETURN 1 as test');
    await session.close();
    
    console.log("Neo4j Conectado com sucesso!");
    return driver;
  } catch (error) {
    console.error("Erro ao iniciar a conexão com Neo4j:", error.message);
    throw error;
  }
};

export { iniciarNeo4j };