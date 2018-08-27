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
	entry_date bigint,
	start_time bigint,
	end_time bigint
);
DELETE FROM entries;
INSERT INTO entries ("text", "project_id", "entry_date", "start_time", "end_time") VALUES 
('entry 1', '1', 1533736800000, 1533736800000, 1533740400000),
('entry 2', '1', 1533736800000, 1533736800000, 1533745800000),
('entry 3', '2', 1536501600000, 1536501600000, 1536508800000);
SELECT * FROM entries;


-- get all entries with entry_date formated as 'MM/DD/YY', along with "project_name" and "hours"
SELECT "entries".*, "projects"."name" as "project_name"
	FROM "entries" JOIN "projects" ON "entries"."project_id" = "projects"."id"
	ORDER BY "entries"."id" ASC;

-- get all projects, including the "total_hours" from all entries for that project
SELECT "projects".*,
	COALESCE(
		SUM(("entries"."end_time" - "entries"."start_time") / 1000 / 60 / 60)
	, 0) 
	AS "total_hours"
	FROM "projects" 
	LEFT JOIN "entries" ON "projects"."id" = "entries"."project_id" 
	GROUP BY "projects"."id" ORDER BY "projects"."id";

