import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('family')
    .addColumn('id', 'varchar(40)', (col) => col.primaryKey().notNull())
    .addColumn('description', 'varchar(100)', (col) => col.notNull())
    .execute();

  const families: { id: string; description: string }[] = [
    { id: '1', description: 'Boxing' },
    { id: '2', description: 'Wrestling' },
  ];

  await db.insertInto('family').values(families).execute();

  await db.schema
    .createTable('skill')
    .addColumn('id', 'varchar(40)', (col) => col.primaryKey().notNull())
    .addColumn('description', 'varchar(100)', (col) => col.notNull())
    .addColumn('purpose', 'varchar(255)', (col) => col.notNull())
    .addColumn('cool_down', 'integer', (col) => col.notNull())
    .addColumn('casting', 'integer', (col) => col.notNull())
    .addColumn('cost', 'integer', (col) => col.notNull())
    .addColumn('base_damage', 'integer', (col) => col.notNull())
    .addColumn('family', 'varchar(40)', (col) =>
      col.references('family.id').onDelete('set null'),
    )
    .execute();

  const skills: {
    id: string;
    description: string;
    family: string;
    purpose: string;
    cool_down: number;
    casting: number;
    cost: number;
    base_damage: number;
  }[] = [
    {
      id: '1',
      description: 'Jab',
      family: '1',
      purpose: 'ATTACK',
      base_damage: 2,
      cool_down: 2,
      casting: 0,
      cost: 2,
    },
    {
      id: '2',
      description: 'Straight Right',
      family: '1',
      purpose: 'ATTACK',
      base_damage: 2,
      cool_down: 2,
      casting: 0,
      cost: 2,
    },
    {
      id: '3',
      description: 'UpperCut',
      family: '1',
      purpose: 'ATTACK',
      base_damage: 2,
      cool_down: 2,
      casting: 0,
      cost: 2,
    },
    {
      id: '4',
      description: 'Left Hook',
      family: '1',
      purpose: 'ATTACK',
      base_damage: 2,
      cool_down: 2,
      casting: 0,
      cost: 2,
    },
    {
      id: '5',
      description: 'Right Hook',
      family: '1',
      purpose: 'ATTACK',
      base_damage: 2,
      cool_down: 2,
      casting: 0,
      cost: 2,
    },
    {
      id: '6',
      description: 'Kimora',
      family: '2',
      purpose: 'ATTACK',
      base_damage: 2,
      cool_down: 2,
      casting: 0,
      cost: 2,
    },
    {
      id: '7',
      description: 'Guillotine',
      family: '2',
      purpose: 'ATTACK',
      base_damage: 2,
      cool_down: 2,
      casting: 0,
      cost: 2,
    },
    {
      id: '8',
      description: 'Arm Bar',
      family: '2',
      purpose: 'ATTACK',
      base_damage: 2,
      cool_down: 2,
      casting: 0,
      cost: 2,
    },
    {
      id: '9',
      description: 'Rear Neck Chocke',
      family: '2',
      purpose: 'ATTACK',
      base_damage: 2,
      cool_down: 2,
      casting: 0,
      cost: 2,
    },
    {
      id: '10',
      description: 'Ankle Lock',
      family: '2',
      purpose: 'ATTACK',
      base_damage: 2,
      cool_down: 2,
      casting: 0,
      cost: 2,
    },
  ];

  await db.insertInto('skill').values(skills).execute();

  await db.schema
    .createTable('character')
    .addColumn('id', 'varchar(40)', (col) => col.primaryKey().notNull())
    .addColumn('nick_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('gender', 'integer', (col) => col.notNull())
    .addColumn('hp', 'integer', (col) => col.notNull())
    .addColumn('xp', 'integer', (col) => col.notNull())
    .addColumn('strength', 'integer', (col) => col.notNull())
    .addColumn('vigor', 'integer', (col) => col.notNull())
    .addColumn('synergy', 'integer', (col) => col.notNull())
    .addColumn('agility', 'integer', (col) => col.notNull())
    .addColumn('dexterity', 'integer', (col) => col.notNull())
    .addColumn('family', 'varchar(40)', (col) =>
      col.references('family.id').onDelete('set null'),
    )
    .execute();

  const characters: {
    id: string;
    nick_name: string;
    gender: number;
    hp: number;
    xp: number;
    strength: number;
    vigor: number;
    synergy: number;
    agility: number;
    dexterity: number;
    family: string;
  }[] = [
    {
      id: '1',
      nick_name: 'Rounda Rousey',
      gender: 1,
      hp: 100,
      xp: 12,
      strength: 32,
      vigor: 48,
      synergy: 32,
      agility: 49,
      dexterity: 59,
      family: '2',
    },
    {
      id: '2',
      nick_name: 'Floyd Mayweather Jr.',
      gender: 0,
      hp: 100,
      xp: 59,
      strength: 42,
      vigor: 58,
      synergy: 32,
      agility: 89,
      dexterity: 29,
      family: '1',
    },
  ];

  await db.insertInto('character').values(characters).execute();

  await db.schema
    .createTable('user')
    .addColumn('id', 'varchar(40)', (col) => col.primaryKey().notNull())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('character', 'varchar(40)', (col) =>
      col.references('character.id').onDelete('set null'),
    )
    .addColumn('current_arena', 'varchar(40)', (col) =>
      col.references('arena.id').onDelete('set null'),
    )
    .execute();

  await db.schema
    .createTable('arena')
    .addColumn('id', 'varchar(40)', (col) => col.primaryKey().notNull())
    .addColumn('home_player', 'varchar(40)', (col) =>
      col.references('user.id').onDelete('set null'),
    )
    .addColumn('away_player', 'varchar(40)', (col) =>
      col.references('user.id').onDelete('set null'),
    )
    .execute();

  const users: {
    id: string;
    name: string;
    character: string;
    current_arena: string | null;
  }[] = [
    {
      id: '1',
      name: 'João',
      character: '2',
      current_arena: null,
    },
    {
      id: '2',
      name: 'Maria',
      character: '1',
      current_arena: null,
    },
  ];

  await db.insertInto('user').values(users).execute();

  await db.schema
    .createTable('friendship')
    .addColumn('id', 'varchar(40)', (col) => col.primaryKey().notNull())
    .addColumn('sender', 'varchar(40)', (col) =>
      col.references('user.id').onDelete('set null'),
    )
    .addColumn('receiver', 'varchar(40)', (col) =>
      col.references('user.id').onDelete('cascade'),
    )
    .addColumn('status', 'integer', (col) => col.notNull())
    .execute();

  const friendShips: {
    id: string;
    sender: string;
    receiver: string;
    status: number;
  }[] = [
    {
      id: '1',
      sender: '1',
      receiver: '2',
      status: 1,
    },
  ];

  await db.insertInto('friendship').values(friendShips).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('character').execute();
  await db.schema.dropTable('arena').execute();
  await db.schema.dropTable('family').execute();
  await db.schema.dropTable('user').execute();
  await db.schema.dropTable('skill').execute();
  await db.schema.dropTable('friendship').execute();
}
