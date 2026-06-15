import { Request, Response, NextFunction } from 'express';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';


export function validationMiddleware<T>(dtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {

    const dtoInstance = plainToInstance(dtoClass, req.body);

    const errors: ValidationError[] = await validate(dtoInstance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const formattedErrors = errors.map(err => ({
        property: err.property,
        constraints: err.constraints ? Object.values(err.constraints) : [],
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Błąd walidacji danych wejściowych',
        errors: formattedErrors,
      });
    }

    req.body = dtoInstance;
    next();
  };
}
