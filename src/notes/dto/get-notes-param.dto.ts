import { z } from 'zod';

export const getNotesQuerySchema = z.object({
  limit: z.coerce
    .number({
      invalid_type_error: 'Limit must be a number',
    })
    .int('Limit must be an integer')
    .positive('Limit must be a positive number')
    .optional(),

  page: z.coerce
    .number({
      invalid_type_error: 'Page must be a number',
    })
    .int('Page must be an integer')
    .positive('Page must be a positive number')
    .min(1, 'Page must be greater than or equal to 1')
    .optional()
});

export type GetNotesQueryDto = z.infer<typeof getNotesQuerySchema>;
