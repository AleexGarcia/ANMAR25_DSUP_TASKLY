import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  status: z.string(),
  priority: z.string(),
  category: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const TaskSchemaWithRelation = TaskSchema.extend({

  notes: z.array(z.object({
    id: z.number(),
    content: z.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
  }))
})

export const PaginationTaskResponse = z.object({
  page: z.number(),
  total: z.number(),
  tasks: z.array(TaskSchema),
});

