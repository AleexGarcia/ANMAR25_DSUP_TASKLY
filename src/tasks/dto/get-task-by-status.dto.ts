import { z } from 'zod';
import { enumWithMessages } from '../../common/helpers/enumWithMessages';
import { TaskStatus } from '../../common/enums/TaskStatus.enum';
const validStatus = Object.values(TaskStatus).join('|');

export const getTaskByStatusSchema = z.object({
  status: enumWithMessages(TaskStatus, validStatus),
});

export type getTaskByStatusDto = z.infer<typeof getTaskByStatusSchema>;
