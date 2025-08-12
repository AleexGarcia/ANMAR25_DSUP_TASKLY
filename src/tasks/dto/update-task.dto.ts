import { enumWithMessages } from '../../common/helpers/enumWithMessages';
import { TaskCategory } from '../../common/enums/TaskCategory.enum';
import { TaskPriority } from '../../common/enums/TaskPriority.enum';
import { TaskStatus } from '../../common/enums/TaskStatus.enum';
import { z } from 'zod';

const validCategories = Object.values(TaskCategory).join('|');
const validStatus = Object.values(TaskStatus).join('|');
const validPriorities = Object.values(TaskPriority).join('|');

export const updateTaskSchema = z.object({
  category: enumWithMessages(TaskCategory, validCategories,'category'),
  status: enumWithMessages(TaskStatus, validStatus,'status'),
  priority: enumWithMessages(TaskPriority, validPriorities,'status'),
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .trim()
    .nonempty('Title cannot be empty')
    .max(45, 'Title must be at most 45 characters long'),

  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    })
    .trim()
    .nonempty('Description cannot be empty')
    .max(255, 'Description must be at most 255 characters long'),
});

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
