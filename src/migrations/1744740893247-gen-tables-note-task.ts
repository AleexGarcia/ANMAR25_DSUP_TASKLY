import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class GenTablesNoteTask1744740893247 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'priority',
            enum: ['low', 'medium', 'high', 'critical'],
            enumName: 'TaskPriority',
            type: 'enum',
            default: "'low'",
          },
          {
            name: 'status',
            enum: ['todo', 'in_progress', 'done'],
            enumName: 'TaskStatus',
            type: 'enum',
            default: "'todo'",
          },
          {
            name: 'category',
            enum: [
              'bug_fixing',
              'feature',
              'testing',
              'documentation',
              'refactoring',
              'security',
              'configuration_management',
              'code_review',
              'optimization',
            ],
            enumName: 'TaskCategory',
            type: 'enum',
            default: "'feature'",
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'notes',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'content',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'taskId',
            type: 'int',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['taskId'],
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notes');
    await queryRunner.dropTable('tasks');
  }
}
