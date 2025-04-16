import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTitleTask1744808305261 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tasks',
      new TableColumn({
        name: 'title',
        type: 'varchar',
        length: '45',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tasks', 'title');
  }
}
