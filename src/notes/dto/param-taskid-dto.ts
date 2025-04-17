import { z } from 'zod';

export const paramTaskIdSchema = z.object({
  taskId: z.coerce
    .number({
      required_error: 'ID is required',
      invalid_type_error: 'ID must be a number',
    })
    .int('ID must be an integer')
    .positive('ID must be a positive number'),
});

export type ParamTaskIdDto = z.infer<typeof paramTaskIdSchema>;
