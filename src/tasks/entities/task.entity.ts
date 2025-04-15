import { TaskCategory } from 'src/common/enums/TaskCategory.enum';
import { TaskPriority } from 'src/common/enums/TaskPriority.enum';
import { TaskStatus } from 'src/common/enums/TaskStatus.enum';
import { Note } from 'src/notes/entities/note.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    enum: TaskStatus,
    enumName: 'TaskStatus',
    default: TaskStatus.todo,
  })
  status: TaskStatus;
  @Column({
    enum: TaskPriority,
    enumName: 'TaskPriority',
    default: TaskPriority.low,
  })
  priority: TaskPriority;
  @Column({
    enum: TaskCategory,
    enumName: 'TaskCategory',
    default: TaskCategory.bug_fixing,
  })
  category: TaskCategory;
  @OneToMany(() => Note, (note) => note.task)
  notes: Note[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
