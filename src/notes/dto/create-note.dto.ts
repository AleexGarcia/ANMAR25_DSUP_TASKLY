import { z } from 'zod';

export const createNoteSchema = z
  .object({
    taskId: z.number(),
    content: z.string().nonempty(),
  })
  .required();

export type CreateNoteDto = z.infer<typeof createNoteSchema>;
