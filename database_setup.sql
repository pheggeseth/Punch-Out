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

-- This gets all entries, with "entry_date" formatted as 'MM/DD/YY', along with the project_name, and difference between start_time and end_time as hours
SELECT "entries".*,
	to_char("entries"."entry_date", 'MM/DD/YY') AS "entry_date",
	"projects"."name" as "project_name", 
	DATE_PART('hour', "entries"."end_time"::time - "entries"."start_time"::time) + 
	DATE_PART('MINUTE', "entries"."end_time"::time - "entries"."start_time"::time) / 60 AS "hours" 
	FROM "entries" JOIN "projects" ON "entries"."project_id" = "projects"."id";
