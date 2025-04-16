import { z } from 'zod';

export const createNoteSchema = z.object({
  taskId: z.number({
    required_error: 'Task ID is required',
    invalid_type_error: 'Task ID must be a number',
  }),

  content: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    })
    .trim()
    .nonempty('Content cannot be empty')
    .max(255, 'Content must be at most 255 characters long'),
});

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
