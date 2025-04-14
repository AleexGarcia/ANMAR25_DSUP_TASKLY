import { TaskCategory } from 'src/common/enums/TaskCategory.enum';
import { TaskPriority } from 'src/common/enums/TaskPriority.enum';
import { TaskStatus } from 'src/common/enums/TaskStatus.enum';
import { z } from 'zod';

export const updateTaskSchema = z.object({
  status: z.nativeEnum(TaskStatus, { message: 'status is required' }),
  priority: z.nativeEnum(TaskPriority, { message: 'priority is required' }),
  category: z.nativeEnum(TaskCategory, { message: 'category is required' }),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
