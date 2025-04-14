import { TaskCategory } from 'src/common/enums/TaskCategory.enum';
import { TaskPriority } from 'src/common/enums/TaskPriority.enum';
import { TaskStatus } from 'src/common/enums/TaskStatus.enum';
import { z } from 'zod';

export const createTaskSchema = z
  .object({
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    category: z.nativeEnum(TaskCategory),
  })
  .required();

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
