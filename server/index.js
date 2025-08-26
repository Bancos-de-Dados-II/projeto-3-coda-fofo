import { config } from "dotenv";
import { conectarBancos, fecharConexoes } from "./config/database.js";
import { app } from "./routes/route.js";

config();

// Conectar aos bancos e iniciar servidor
conectarBancos()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(` API rodando na porta ${process.env.PORT}`)
    );
  })
  .catch((error) => {
    console.error(" Falha ao iniciar a aplicação:", error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Desligando servidor...');
  await fecharConexoes();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log(' Desligando servidor (SIGTERM)...');
  await fecharConexoes();
  process.exit(0);
});