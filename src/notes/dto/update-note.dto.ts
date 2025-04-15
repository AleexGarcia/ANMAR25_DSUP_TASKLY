import { z } from 'zod';
export const updateNoteSchema = z
  .object({
    content: z.string().nonempty(),
  })
  .required();

export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
