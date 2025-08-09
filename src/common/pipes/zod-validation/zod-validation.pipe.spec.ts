import { ZodValidationPipe } from './zod-validation.pipe';
import { z, ZodError } from 'zod';
import { BadRequestException, ArgumentMetadata } from '@nestjs/common';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    name: z.string().min(3, 'Name must have at least 3 characters'),
    age: z.number().int().positive('Age must be a positive integer'),
  });
  type Dto = z.infer<typeof schema>;
  let pipe: ZodValidationPipe;

  beforeEach(() => {
    pipe = new ZodValidationPipe(schema);
  });

  it('should parse and return valid data', () => {
    const validData = { name: 'Alex', age: 25 };
    expect(pipe.transform(validData, { metatype: Object, type: 'body', data: '' })).toEqual(validData);
  });

  it('should throw BadRequestException with error messages for invalid data', () => {
    const invalidData = { name: 'Al', age: -1 };

    try {
      pipe.transform(invalidData,  { metatype: Object, type: 'body', data: '' });
      fail('Expected BadRequestException to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      const response = error.getResponse();
      expect(response.message).toContain('Name must have at least 3 characters');
      expect(response.message).toContain('Age must be a positive integer');
    }
  });

  it('should throw generic BadRequestException for unknown errors', () => {
    const pipeWithMock = new ZodValidationPipe({
      parse: () => {
        throw new Error('Unknown error');
      },
    } as any);

    try {
      pipeWithMock.transform({},  { metatype: Object, type: 'body', data: '' });
      fail('Expected BadRequestException to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe('Validation failed');
    }
  });
});
