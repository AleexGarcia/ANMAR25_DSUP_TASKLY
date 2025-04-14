import { createNoteSchema } from './create-note.dto';
import { z } from 'zod';

export type UpdateNoteDto = z.infer<typeof createNoteSchema>;
