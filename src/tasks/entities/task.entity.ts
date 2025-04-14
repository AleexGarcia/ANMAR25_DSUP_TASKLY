import { TaskCategory } from 'src/common/enums/TaskCategory.enum';
import { TaskPriority } from 'src/common/enums/TaskPriority.enum';
import { TaskStatus } from 'src/common/enums/TaskStatus.enum';
import { Note } from 'src/notes/entities/note.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ enum: TaskStatus, enumName: 'TaskStatus' })
  status: TaskStatus;
  @Column({ enum: TaskPriority, enumName: 'TaskPriority' })
  priority: TaskPriority;
  @Column({ enum: TaskCategory, enumName: 'TaskCategory' })
  category: TaskCategory;
  @OneToMany(() => Note, (note) => note.task_id)
  notes: Note[];
}
