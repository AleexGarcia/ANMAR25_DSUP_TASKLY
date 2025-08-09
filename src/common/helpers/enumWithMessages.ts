import { z } from 'zod';

export function enumWithMessages<T extends z.EnumLike>(
  enumObj: T,
  validValues: string,
  fieldName: string,
) {
  return z.nativeEnum(enumObj, {
    errorMap: (issue) => {
      if (issue.code === 'invalid_type') {
        return { message: `${fieldName} is required` };
      }
      if (issue.code === 'invalid_enum_value') {
        return {
          message: `Invalid value. Valid ${fieldName} are: ${validValues}`,
        };
      }
      return { message: 'Invalid value' };
    },
  });
}
