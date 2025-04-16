import { TaskCategory } from '../../common/enums/TaskCategory.enum';
import { TaskPriority } from '../../common/enums/TaskPriority.enum';
import { TaskStatus } from '../../common/enums/TaskStatus.enum';
import { z } from 'zod';

const validCategories = Object.values(TaskCategory).join(', ');
const validStatuses = Object.values(TaskStatus).join(', ');
const validPriorities = Object.values(TaskPriority).join(', ');

export const getTaskQuerySchema = z.object({
  category: z
    .nativeEnum(TaskCategory, {
      errorMap: (issue) => {
        if (issue.code === 'invalid_enum_value') {
          return {
            message: `Invalid category. Valid options are: ${validCategories}`,
          };
        }
        return { message: 'Invalid category' };
      },
    })
    .optional(),

  priority: z
    .nativeEnum(TaskPriority, {
      errorMap: (issue) => {
        if (issue.code === 'invalid_enum_value') {
          return {
            message: `Invalid priority. Valid options are: ${validPriorities}`,
          };
        }
        return { message: 'Invalid priority' };
      },
    })
    .optional(),

  status: z
    .nativeEnum(TaskStatus, {
      errorMap: (issue) => {
        if (issue.code === 'invalid_enum_value') {
          return {
            message: `Invalid status. Valid options are: ${validStatuses}`,
          };
        }
        return { message: 'Invalid status' };
      },
    })
    .optional(),

  title: z
    .string({
      invalid_type_error: 'Title must be a string',
    })
    .optional(),

  order: z
    .enum(['asc', 'desc'], {
      errorMap: () => ({
        message: "Order must be either 'asc' or 'desc'",
      }),
    })
    .optional(),

  limit: z
    .number({
      invalid_type_error: 'Limit must be a number',
    })
    .int('Limit must be an integer')
    .positive('Limit must be a positive number')
    .default(5),

  page: z
    .number({
      invalid_type_error: 'Page must be a number',
    })
    .int('Page must be an integer')
    .positive('Page must be a positive number')
    .default(1),
});

export type GetTaskQuery = z.infer<typeof getTaskQuerySchema>;
