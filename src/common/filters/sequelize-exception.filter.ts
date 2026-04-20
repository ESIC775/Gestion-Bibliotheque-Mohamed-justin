import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  DatabaseError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError,
} from 'sequelize';

@Catch(ValidationError, UniqueConstraintError, ForeignKeyConstraintError, DatabaseError)
export class SequelizeExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof UniqueConstraintError) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Conflit de données : une valeur unique existe déjà.',
        details: exception.errors.map((error) => error.message),
      });
    }

    if (exception instanceof ForeignKeyConstraintError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Référence relationnelle invalide.',
        details: exception.message,
      });
    }

    if (exception instanceof ValidationError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Erreur de validation côté base de données.',
        details: exception.errors.map((error) => error.message),
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erreur base de données.',
      details: exception.message,
    });
  }
}
