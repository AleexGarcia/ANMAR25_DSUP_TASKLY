import { TaskCategory } from "../enums/TaskCategory.enum";
import { TaskPriority } from "../enums/TaskPriority.enum";
import { TaskStatus } from "../enums/TaskStatus.enum";
import { enumWithMessages } from "./enumWithMessages";

describe('enumWithMessages helper',() => {
    const validCategories = Object.values(TaskCategory).join('|');
    const validStatus = Object.values(TaskStatus).join('|');
    const validPriorities = Object.values(TaskPriority).join('|');

    const schema1 = enumWithMessages(TaskCategory,validCategories,'category');
    const schema2 = enumWithMessages(TaskStatus,validStatus,'status');
    const schema3 = enumWithMessages(TaskPriority,validPriorities,'priority');

    it('should pass validation for a valid enum value', () => {
        expect(() => schema1.parse(TaskCategory.bug_fixing)).not.toThrow();
        expect(() => schema2.parse(TaskStatus.done)).not.toThrow();
        expect(() => schema3.parse(TaskPriority.critical)).not.toThrow();
    })

    it('should fail validation when value is missing', () => {
    try {
      schema1.parse(undefined);
    } catch (e) {
      expect(e.errors[0].message).toBe('category is required');
    }
    try {
      schema2.parse(undefined);
    } catch (e) {
      expect(e.errors[0].message).toBe('status is required');
    }
    try {
      schema3.parse(undefined);
    } catch (e) {
      expect(e.errors[0].message).toBe('priority is required');
    }
  });

  it('should fail validation when value is invalid', () => {
    try {
      schema1.parse('invalidValue');
    } catch (e) {
      expect(e.errors[0].message).toBe(`Invalid value. Valid category are: ${validCategories}`);
    }
    try {
      schema2.parse('invalidValue');
    } catch (e) {
      expect(e.errors[0].message).toBe(`Invalid value. Valid status are: ${validStatus}`);
    }
    try {
      schema3.parse('invalidValue');
    } catch (e) {
      expect(e.errors[0].message).toBe(`Invalid value. Valid priority are: ${validPriorities}`);
    }
  });
  it('should return default error message for unknown issues', () => {
    const errorMap = (schema1._def as any).errorMap;
    const fakeIssue = {code: 'custom', path: ['category']};
    const result = errorMap(fakeIssue);
    expect(result.message).toBe('Invalid value');
  });

})