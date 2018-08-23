-- POSTGRESQL DEV DATABASE SETUP
CREATE TABLE projects(
	id SERIAL PRIMARY KEY,
	name VARCHAR(100)
);

CREATE TABLE entries (
	id SERIAL PRIMARY KEY,
	text VARCHAR(255),
	project_id integer REFERENCES projects,
	entry_date date,
	start_time VARCHAR(10),
	end_time VARCHAR(10)
);

DROP TABLE entries;

INSERT INTO projects ("name") VALUES ('Project 1'), ('Project 2');

SELECT * FROM projects;

INSERT INTO entries ("text", "project_id", "entry_date", "start_time", "end_time") VALUES 
('entry 1', '1', '8/8/18', '9:00am', '5:00pm'),
('entry 2', '2', '9/9/19', '9:00am', '5:00pm');

SELECT * FROM entries;
