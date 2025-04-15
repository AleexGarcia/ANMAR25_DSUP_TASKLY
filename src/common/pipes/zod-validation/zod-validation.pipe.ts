import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsedValue = this.schema.parse(value);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return parsedValue;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        console.log(error);
        throw new BadRequestException(error.errors.map((err) => err.message));
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
