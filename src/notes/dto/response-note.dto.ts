import { z } from 'zod';

export const NoteSchema = z.object({
    id: z.number(),
    taskId: z.number(),
    content: z.string(),
    created_at: z.string().transform(str => new Date(str)),
    updated_at: z.string().transform(str => new Date(str))
})

export const PaginationNoteResponse = z.object({
    page: z.number(),
    total: z.number(),
    notes: z.array(NoteSchema),
})

export type ResponseNoteDto = z.infer<typeof NoteSchema>;

export type PaginationResponseDto = z.infer<typeof PaginationNoteResponse>;