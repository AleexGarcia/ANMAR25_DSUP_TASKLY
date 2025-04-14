import { z } from 'zod';

export const createNoteSchema = z
  .object({
    task_id: z.number(),
    content: z.string(),
  })
  .required();

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
