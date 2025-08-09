import { TaskStatus } from '../../common/enums/TaskStatus.enum';
import { TaskPriority } from '../../common/enums/TaskPriority.enum';
import { TaskCategory } from '../../common/enums/TaskCategory.enum';
import { Note } from '../../notes/entities/note.entity';

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
  @Column()
  title: string;
  @Column()
  description: string;
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
  constructor(title: string, description: string, category: TaskCategory, status?: TaskStatus, priority?: TaskPriority) {
    this.category = category;
    this.title = title;
    this.description = description;
    this.status = status ? status : TaskStatus.todo;
    this.priority = priority ? priority : TaskPriority.low;
  }
}
