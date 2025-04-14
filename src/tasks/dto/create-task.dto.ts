import { TaskCategory } from 'src/common/enums/TaskCategory.enum';
import { TaskPriority } from 'src/common/enums/TaskPriority.enum';
import { TaskStatus } from 'src/common/enums/TaskStatus.enum';
import { z } from 'zod';

export const createTaskSchema = z.object({
  category: z.nativeEnum(TaskCategory, { message: 'category is required' }),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
