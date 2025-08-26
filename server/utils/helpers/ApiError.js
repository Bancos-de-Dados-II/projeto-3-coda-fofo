import {
  BAD_REQUEST,
  CONFLICT,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from "./codigosRequisicao.js";

export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Requisição inválida") {
    super(message, BAD_REQUEST);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Não autorizado") {
    super(message, UNAUTHORIZED);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Ação não permitida") {
    super(message, FORBIDDEN);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Recurso não encontrado") {
    super(message, NOT_FOUND);
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflito de dados") {
    super(message, CONFLICT);
  }
}

export class UnprocessableEntityError extends ApiError {
  constructor(message = "Dados inválidos") {
    super(message, UNPROCESSABLE_ENTITY);
  }
}
