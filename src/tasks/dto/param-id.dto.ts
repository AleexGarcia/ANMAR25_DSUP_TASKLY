import { z } from 'zod';

export const paramIdSchema = z.object({
  id: z.coerce
    .number({
      required_error: 'ID is required',
      invalid_type_error: 'ID must be a number',
    })
    .int('ID must be an integer')
    .positive('ID must be a positive number'),
});

export type ParamIdDto = z.infer<typeof paramIdSchema>;
