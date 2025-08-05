import { enumWithMessages } from '../../common/helpers/enumWithMessages';
import { TaskCategory } from '../../common/enums/TaskCategory.enum';
import { TaskPriority } from '../../common/enums/TaskPriority.enum';
import { TaskStatus } from '../../common/enums/TaskStatus.enum';
import { z } from 'zod';

const validCategories = Object.values(TaskCategory).join('|');
const validStatus = Object.values(TaskStatus).join('|');
const validPriorities = Object.values(TaskPriority).join('|');

export const getTaskQuerySchema = z.object({
  category: enumWithMessages(TaskCategory, validCategories).optional(),
  status: enumWithMessages(TaskStatus, validStatus).optional(),
  priority: enumWithMessages(TaskPriority, validPriorities).optional(),
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .trim()
    .nonempty('Title cannot be empty')
    .optional(),

  order: z
    .enum(['asc', 'desc'], {
      errorMap: () => ({
        message: "Order must be either 'asc' or 'desc'",
      }),
    })
    .optional(),

  limit: z.coerce
    .number({
      invalid_type_error: 'Limit must be a number',
    })
    .int('Limit must be an integer')
    .positive('Limit must be a positive number')
    .default(5),

  page: z.coerce
    .number({
      invalid_type_error: 'Page must be a number',
    })
    .int('Page must be an integer')
    .positive('Page must be a positive number')
    .min(1, 'Page must be greater than or equal to 1')
    .default(1),
});

export type GetTaskQuery = z.infer<typeof getTaskQuerySchema>;
