import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Task, (task) => task.notes)
  task_id: Task;
  @Column({ nullable: false })
  content: string;
}
