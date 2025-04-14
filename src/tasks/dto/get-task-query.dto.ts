import { TaskCategory } from 'src/common/enums/TaskCategory.enum';
import { TaskPriority } from 'src/common/enums/TaskPriority.enum';
import { TaskStatus } from 'src/common/enums/TaskStatus.enum';
import { z } from 'zod';

export const getTaskQuerySchema = z.object({
  category: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.nativeEnum(TaskCategory))
    .optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
});

export type GetTaskQuery = z.infer<typeof getTaskQuerySchema>;
