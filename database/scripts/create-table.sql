-- Script to create the tables 

DROP TABLE character;
CREATE TABLE "character" (
	id VARCHAR NOT NULL PRIMARY KEY,
	nick_name VARCHAR NOT NULL,
	family VARCHAR NOT NULL,
	gender INTEGER NOT NULL,
	hp INTEGER NOT NULL,
	xp INTEGER NOT NULL,
	strength INTEGER NOT NULL,
	vigor INTEGER NOT NULL,
	synergy INTEGER NOT NULL,
	agility INTEGER NOT NULL,
	dexterity INTEGER NOT NULL,

	FOREIGN KEY (family)
		REFERENCES family(id)
	
	);

DROP TABLE "user";
CREATE TABLE user(
	id VARCHAR NOT NULL PRIMARY KEY,
	name VARCHAR NOT NULL UNIQUE,
	character VARCHAR,
	current_arena VARCHAR,
	FOREIGN KEY (character)
		REFERENCES character(id),
	FOREIGN KEY (current_arena)
		REFERENCES arena(id)
);

CREATE TABLE family(
	id VARCHAR NOT NULL PRIMARY KEY,
	description VARCHAR NOT NULL
);

DROP TABLE arena;
CREATE TABLE arena(
	id VARCHAR NOT NULL,
	home_player VARCHAR NOT NULL,
	away_player VARCHAR NOT NULL,
	status INTEGER NOT NULL,
	
	FOREIGN KEY (home_player)
		REFERENCES user(id),
		
	FOREIGN KEY (away_player)
		REFERENCES user(id)
);

