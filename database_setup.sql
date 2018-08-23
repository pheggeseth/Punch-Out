-- reset projects table
DROP TABLE entries;
DROP TABLE projects;
CREATE TABLE projects(
	id SERIAL PRIMARY KEY,
	name VARCHAR(100)
);
INSERT INTO projects ("name") VALUES ('Project 1'), ('Project 2');
SELECT * FROM projects;


-- reset entries table
DROP TABLE entries;
CREATE TABLE entries (
	id SERIAL PRIMARY KEY,
	text VARCHAR(255),
	project_id integer REFERENCES projects,
	entry_date date,
	start_time time,
	end_time time
);
INSERT INTO entries ("text", "project_id", "entry_date", "start_time", "end_time") VALUES 
('entry 1', '1', '8/8/18', '9:00 AM', '11:30 AM'),
('entry 2', '1', '8/8/18', '9:00 AM', '11:00 AM'),
('entry 3', '2', '9/9/19', '9:00 AM', '10:30 AM');
SELECT * FROM entries;


-- get all entries with entry_date formated as 'MM/DD/YY', along with "project_name" and "hours"
SELECT "entries".*,
	to_char("entries"."entry_date", 'MM/DD/YY') AS "entry_date",
	"projects"."name" as "project_name", 
	DATE_PART('hour', "entries"."end_time"::time - "entries"."start_time"::time) + 
	DATE_PART('MINUTE', "entries"."end_time"::time - "entries"."start_time"::time) / 60 AS "hours" 
	FROM "entries" JOIN "projects" ON "entries"."project_id" = "projects"."id";

-- get all projects, including the "total_hours" from all entries for that project
SELECT "projects".*, 
	SUM(DATE_PART('hour', "entries"."end_time"::time - "entries"."start_time"::time) + 
		DATE_PART('MINUTE', "entries"."end_time"::time - "entries"."start_time"::time) / 60) 
		AS "total_hours" 
	FROM "projects" JOIN "entries" ON "projects"."id" = "entries"."project_id" GROUP BY "projects"."id" ORDER BY "projects"."id";
