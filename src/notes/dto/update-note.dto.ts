import { z } from 'zod';
export const updateNoteSchema = z.object({
  content: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    })
    .trim()
    .nonempty('Content cannot be empty')
    .max(255, 'Content must be at most 255 characters long'),
});

export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
