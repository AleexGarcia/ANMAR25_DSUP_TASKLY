import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnDescriptionInTasks1744824802281
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tasks',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        length: '255',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tasks', 'description');
  }
}
