import { TaskStatus } from 'src/common/enums/TaskStatus.enum';
import { enumWithMessages } from 'src/common/helpers/enumWithMessages';
import { z } from 'zod';
const validStatus = Object.values(TaskStatus).join('|');

export const getTaskByStatusSchema = z.object({
  status: enumWithMessages(TaskStatus, validStatus),
});

export type getTaskByStatusDto = z.infer<typeof getTaskByStatusSchema>;
