import { z } from 'zod';

export function enumWithMessages<T extends z.EnumLike>(
  enumObj: T,
  validValues: string,
) {
  return z.nativeEnum(enumObj, {
    errorMap: (issue) => {
      if (issue.code === 'invalid_type') {
        return { message: `${issue.path[0]} is required` };
      }
      if (issue.code === 'invalid_enum_value') {
        return {
          message: `Invalid value. Valid ${issue.path[0]} are: ${validValues}`,
        };
      }
      return { message: 'Invalid value' };
    },
  });
}
