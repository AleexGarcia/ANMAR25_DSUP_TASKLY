import { TaskCategory } from 'src/common/enums/TaskCategory.enum';
import { TaskPriority } from 'src/common/enums/TaskPriority.enum';
import { TaskStatus } from 'src/common/enums/TaskStatus.enum';
import { z } from 'zod';

export const updateTaskSchema = z.object({
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  category: z.nativeEnum(TaskCategory),
  id: z.number(),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
