// middlewares/errorMiddleware.js

import { ApiError } from "../../utils/helpers/ApiError.js";
import { INTERNAL_ERROR } from "../../utils/helpers/codigosRequisicao.js";

function errorMiddleware(err, req, res, next) {
  const status = err instanceof ApiError ? err.statusCode : INTERNAL_ERROR;
  const message = err.message || "Erro interno no servidor";

  res.status(status).json({
    success: false,
    message,
  });
}

export { errorMiddleware };
